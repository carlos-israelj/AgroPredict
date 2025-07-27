const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgroPredict MVP Tests", function () {
  let agroPredict;
  let owner, farmer1, farmer2, buyer1, buyer2;
  let addresses;

  beforeEach(async function () {
    // Get signers
    [owner, farmer1, farmer2, buyer1, buyer2, ...addresses] = await ethers.getSigners();
    
    // Deploy contract
    const AgroPredict = await ethers.getContractFactory("AgroPredict");
    agroPredict = await AgroPredict.deploy();
    await agroPredict.deployed();
  });

  describe("🏗️ Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await agroPredict.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct name and symbol", async function () {
      expect(await agroPredict.name()).to.equal("AgroPredict Crop Tokens");
      expect(await agroPredict.symbol()).to.equal("AGRO");
    });

    it("Should start with 2.5% platform fee", async function () {
      expect(await agroPredict.platformFee()).to.equal(250);
    });
  });

  describe("👨‍🌾 Farmer Verification", function () {
    it("Should allow owner to verify farmers", async function () {
      await agroPredict.verifyFarmer(farmer1.address);
      expect(await agroPredict.verifiedFarmers(farmer1.address)).to.be.true;
    });

    it("Should emit FarmerVerified event", async function () {
      await expect(agroPredict.verifyFarmer(farmer1.address))
        .to.emit(agroPredict, "FarmerVerified")
        .withArgs(farmer1.address);
    });

    it("Should not allow non-owners to verify farmers", async function () {
      await expect(
        agroPredict.connect(farmer1).verifyFarmer(farmer2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("📊 Price Predictions", function () {
    it("Should allow owner to update price predictions", async function () {
      const cropType = "CACAO";
      const price = ethers.utils.parseEther("140");
      const confidence = 85;
      const targetDate = Math.floor(Date.now() / 1000) + 86400; // 1 day

      await agroPredict.updatePricePrediction(cropType, price, confidence, targetDate);
      
      const prediction = await agroPredict.getPrediction(cropType);
      expect(prediction.cropType).to.equal(cropType);
      expect(prediction.predictedPrice).to.equal(price);
      expect(prediction.confidence).to.equal(confidence);
    });

    it("Should not allow confidence > 100", async function () {
      await expect(
        agroPredict.updatePricePrediction("CACAO", ethers.utils.parseEther("140"), 101, Date.now())
      ).to.be.revertedWith("Confidence must be <= 100");
    });

    it("Should emit PricePredictionUpdated event", async function () {
      const cropType = "BANANO";
      const price = ethers.utils.parseEther("25");
      const confidence = 78;

      await expect(
        agroPredict.updatePricePrediction(cropType, price, confidence, Date.now())
      ).to.emit(agroPredict, "PricePredictionUpdated")
       .withArgs(cropType, price, confidence);
    });
  });

  describe("🌾 Crop Token Minting", function () {
    beforeEach(async function () {
      await agroPredict.verifyFarmer(farmer1.address);
    });

    it("Should allow verified farmers to mint tokens", async function () {
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400; // 1 day
      
      await expect(
        agroPredict.connect(farmer1).mintCropToken(
          "CACAO",
          50, // quintales
          ethers.utils.parseEther("140"), // price per quintal
          deliveryDate,
          "Tenguel, Guayas",
          "QmTestHash"
        )
      ).to.emit(agroPredict, "CropTokenMinted");
    });

    it("Should not allow unverified farmers to mint", async function () {
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      await expect(
        agroPredict.connect(farmer2).mintCropToken(
          "CACAO", 50, ethers.utils.parseEther("140"), deliveryDate, "Location", "Hash"
        )
      ).to.be.revertedWith("Farmer not verified");
    });

    it("Should not allow past delivery dates", async function () {
      const pastDate = Math.floor(Date.now() / 1000) - 86400; // 1 day ago
      
      await expect(
        agroPredict.connect(farmer1).mintCropToken(
          "CACAO", 50, ethers.utils.parseEther("140"), pastDate, "Location", "Hash"
        )
      ).to.be.revertedWith("Delivery date must be in future");
    });

    it("Should track farmer tokens correctly", async function () {
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      await agroPredict.connect(farmer1).mintCropToken(
        "CACAO", 50, ethers.utils.parseEther("140"), deliveryDate, "Location", "Hash"
      );
      
      const farmerTokens = await agroPredict.getFarmerTokens(farmer1.address);
      expect(farmerTokens.length).to.equal(1);
      expect(farmerTokens[0]).to.equal(0);
    });
  });

  describe("💰 Token Purchase", function () {
    let tokenId;
    const quantity = 50;
    const pricePerQuintal = ethers.utils.parseEther("140");
    const totalPrice = quantity * parseInt(ethers.utils.formatEther(pricePerQuintal));

    beforeEach(async function () {
      await agroPredict.verifyFarmer(farmer1.address);
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      await agroPredict.connect(farmer1).mintCropToken(
        "CACAO", quantity, pricePerQuintal, deliveryDate, "Location", "Hash"
      );
      tokenId = 0;
    });

    it("Should allow buying available tokens", async function () {
      const payment = ethers.utils.parseEther((totalPrice + 100).toString()); // Extra payment
      
      await expect(
        agroPredict.connect(buyer1).buyCropToken(tokenId, { value: payment })
      ).to.emit(agroPredict, "CropTokenSold");
    });

    it("Should calculate platform fee correctly", async function () {
      const payment = ethers.utils.parseEther(totalPrice.toString());
      const initialFarmerBalance = await farmer1.getBalance();
      
      await agroPredict.connect(buyer1).buyCropToken(tokenId, { value: payment });
      
      const finalFarmerBalance = await farmer1.getBalance();
      const expectedFee = payment.mul(250).div(10000); // 2.5%
      const expectedFarmerPayment = payment.sub(expectedFee);
      
      expect(finalFarmerBalance.sub(initialFarmerBalance)).to.equal(expectedFarmerPayment);
    });

    it("Should not allow buying already sold tokens", async function () {
      const payment = ethers.utils.parseEther(totalPrice.toString());
      
      await agroPredict.connect(buyer1).buyCropToken(tokenId, { value: payment });
      
      await expect(
        agroPredict.connect(buyer2).buyCropToken(tokenId, { value: payment })
      ).to.be.revertedWith("Token already sold");
    });

    it("Should require sufficient payment", async function () {
      const insufficientPayment = ethers.utils.parseEther("1000"); // Less than required
      
      await expect(
        agroPredict.connect(buyer1).buyCropToken(tokenId, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("📦 Delivery Confirmation", function () {
    let tokenId;

    beforeEach(async function () {
      await agroPredict.verifyFarmer(farmer1.address);
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      await agroPredict.connect(farmer1).mintCropToken(
        "CACAO", 50, ethers.utils.parseEther("140"), deliveryDate, "Location", "Hash"
      );
      tokenId = 0;
      
      const payment = ethers.utils.parseEther("7000");
      await agroPredict.connect(buyer1).buyCropToken(tokenId, { value: payment });
    });

    it("Should allow buyer to confirm delivery", async function () {
      await expect(
        agroPredict.connect(buyer1).confirmDelivery(tokenId)
      ).to.emit(agroPredict, "CropDelivered");
    });

    it("Should allow farmer to confirm delivery", async function () {
      await expect(
        agroPredict.connect(farmer1).confirmDelivery(tokenId)
      ).to.emit(agroPredict, "CropDelivered");
    });

    it("Should not allow unauthorized confirmation", async function () {
      await expect(
        agroPredict.connect(farmer2).confirmDelivery(tokenId)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should not allow double confirmation", async function () {
      await agroPredict.connect(buyer1).confirmDelivery(tokenId);
      
      await expect(
        agroPredict.connect(buyer1).confirmDelivery(tokenId)
      ).to.be.revertedWith("Already delivered");
    });
  });

  describe("📊 Statistics and Views", function () {
    beforeEach(async function () {
      await agroPredict.verifyFarmer(farmer1.address);
      await agroPredict.verifyFarmer(farmer2.address);
      
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      // Create multiple tokens
      await agroPredict.connect(farmer1).mintCropToken(
        "CACAO", 50, ethers.utils.parseEther("140"), deliveryDate, "Location1", "Hash1"
      );
      await agroPredict.connect(farmer2).mintCropToken(
        "BANANO", 100, ethers.utils.parseEther("25"), deliveryDate, "Location2", "Hash2"
      );
      
      // Buy one token
      await agroPredict.connect(buyer1).buyCropToken(0, { 
        value: ethers.utils.parseEther("7000") 
      });
    });

    it("Should return correct statistics", async function () {
      const stats = await agroPredict.getStats();
      
      expect(stats.totalTokens).to.equal(2);
      expect(stats.availableTokens).to.equal(1);
      expect(stats.soldTokens).to.equal(1);
    });

    it("Should return available tokens correctly", async function () {
      const available = await agroPredict.getAvailableTokens();
      expect(available.length).to.equal(1);
      expect(available[0]).to.equal(1); // Second token should be available
    });

    it("Should return crop token details", async function () {
      const token = await agroPredict.getCropToken(0);
      expect(token.farmer).to.equal(farmer1.address);
      expect(token.cropType).to.equal("CACAO");
      expect(token.quantity).to.equal(50);
      expect(token.isSold).to.be.true;
    });
  });

  describe("⚙️ Administrative Functions", function () {
    it("Should allow owner to change platform fee", async function () {
      await agroPredict.setPlatformFee(500); // 5%
      expect(await agroPredict.platformFee()).to.equal(500);
    });

    it("Should not allow fee > 10%", async function () {
      await expect(
        agroPredict.setPlatformFee(1001)
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });

    it("Should allow owner to withdraw fees", async function () {
      // First, generate some fees by selling a token
      await agroPredict.verifyFarmer(farmer1.address);
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      await agroPredict.connect(farmer1).mintCropToken(
        "CACAO", 50, ethers.utils.parseEther("140"), deliveryDate, "Location", "Hash"
      );
      
      await agroPredict.connect(buyer1).buyCropToken(0, { 
        value: ethers.utils.parseEther("7000") 
      });
      
      const initialBalance = await owner.getBalance();
      const contractBalance = await ethers.provider.getBalance(agroPredict.address);
      
      expect(contractBalance).to.be.gt(0);
      
      await agroPredict.withdrawFees();
      
      const finalBalance = await owner.getBalance();
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("🚨 Emergency Functions", function () {
    let tokenId;

    beforeEach(async function () {
      await agroPredict.verifyFarmer(farmer1.address);
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400;
      
      await agroPredict.connect(farmer1).mintCropToken(
        "CACAO", 50, ethers.utils.parseEther("140"), deliveryDate, "Location", "Hash"
      );
      tokenId = 0;
    });

    it("Should allow farmer to emergency withdraw unsold token", async function () {
      await agroPredict.connect(farmer1).emergencyWithdraw(tokenId);
      
      await expect(
        agroPredict.getCropToken(tokenId)
      ).to.be.revertedWith("Token does not exist");
    });

    it("Should not allow emergency withdraw of sold tokens", async function () {
      await agroPredict.connect(buyer1).buyCropToken(tokenId, { 
        value: ethers.utils.parseEther("7000") 
      });
      
      await expect(
        agroPredict.connect(farmer1).emergencyWithdraw(tokenId)
      ).to.be.revertedWith("Token already sold");
    });

    it("Should not allow non-owners to emergency withdraw", async function () {
      await expect(
        agroPredict.connect(farmer2).emergencyWithdraw(tokenId)
      ).to.be.revertedWith("Not token owner");
    });
  });
});