import Express from "express";
import controllerCall from "../Middlewares/ControllerCall";
const app = Express();

export default async controller => {
  const call = controllerCall(controller);

  app.get("/:user_id", async (req, res, next) => {
    const { user_id } = req.params;
    call("getUser", user_id, res, next);
  });

  app.get("/", async (req, res, next) => {
    call("getAllUsers", req, res, next);
  });

  app.post("/", async (req, res, next) => {
    call("createUser", { ...req.body }, res, next);
  });

  app.patch("/:user_id", async (req, res, next) => {
    const { user_id } = req.params;
    call("updateUser", { user_id, ...req.body }, res, next);
  });

  app.delete("/:user_id", async (req, res, next) => {
    const { user_id } = req.params;
    call("deleteUser", user_id, res, next);
  });
  return app;
};
