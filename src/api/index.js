const AuthRouter = require("./routes/auth.route.js");
     

const { Router } = require("express");
const DocRouter = require("./routes/doc.route.js");
const rootRouter = Router();
rootRouter.use("/auth", AuthRouter);
rootRouter.use("/doc", DocRouter);


module.exports = rootRouter;
