const Router = require("express");
const router = new Router();
const productController = require("../controllers/productController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), productController.create);
router.get("/", productController.getAll);
router.get("/search/:search", productController.getSearchProduct);
// router.get('/filter/:typeName?/:brandName?', productController.getAll)
router.get("/:id", productController.getOne);
router.delete("/:id", productController.delete);

module.exports = router; 
