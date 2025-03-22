const express = require("express")

const productController = require("../controllers/productController")
const productValidator = require("../validator/productValidator")
const verifyToken = require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/createProduct",verifyToken,productValidator.createProductValidator,productController.createProduct);
router.put("/updateProduct/:id",verifyToken,productValidator.updateProductValidator,productController.updateProduct);
router.get("/getProductByid/:id",verifyToken,productValidator.getProductByIdValidator,productController.getProductByid);
router.delete("/deleteProduct/:id",verifyToken,productValidator.deleteProductValidator,productController.deleteProduct);
router.get("/getAllProduct",verifyToken,productController.getAllProduct);

module.exports = router;