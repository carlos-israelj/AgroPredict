const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgroPredict", function () {
  let agroPredict;
  let owner;
  let farmer1;
  let farmer2;

  beforeEach(async function () {
    [owner, farmer1, farmer2] = await ethers.getSigners();
    
    const AgroPredict = await ethers.getContractFactory("AgroPredict");
    agroPredict = await AgroPredict.deploy();
  });

  describe("Precios", function () {
    it("Debe tener precios iniciales", async function () {
      const cacaoPrice = await agroPredict.currentPrice(0);
      expect(cacaoPrice).to.equal(320);
    });

    it("Owner puede actualizar precios", async function () {
      await agroPredict.updatePrice(0, 400);
      const newPrice = await agroPredict.currentPrice(0);
      expect(newPrice).to.equal(400);
    });

    it("No-owner no puede actualizar precios", async function () {
      await expect(
        agroPredict.connect(farmer1).updatePrice(0, 400)
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  describe("Órdenes", function () {
    it("Farmer puede crear orden de venta", async function () {
      await agroPredict.connect(farmer1).createOrder(0, 1000, 350, true);
      
      const order = await agroPredict.orders(0);
      expect(order.farmer).to.equal(farmer1.address);
      expect(order.quantity).to.equal(1000);
      expect(order.pricePerKg).to.equal(350);
    });

    it("Puede obtener órdenes activas", async function () {
      await agroPredict.connect(farmer1).createOrder(0, 1000, 350, true);
      await agroPredict.connect(farmer2).createOrder(0, 500, 340, true);
      
      const activeOrders = await agroPredict.getActiveOrders(0, true);
      expect(activeOrders.length).to.equal(2);
    });
  });

  describe("Alertas", function () {
    it("Usuario puede establecer alerta de precio", async function () {
      await agroPredict.connect(farmer1).setPriceAlert(0, 400);
      const alert = await agroPredict.priceAlerts(farmer1.address, 0);
      expect(alert).to.equal(400);
    });
  });
});