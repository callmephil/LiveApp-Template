import Express from "express";
import controllerCall from "../Middlewares/ControllerCall";
const app = Express();

export default async controller => {
  const call = controllerCall(controller);

  app.get("/:unicorn_id", async (req, res, next) => {
    const { unicorn_id } = req.params;
    call("getUnicorn", unicorn_id, res, next);
  });

  app.get("/", async (req, res, next) => {
    call("getAllUnicorns", req, res, next);
  });

  app.post("/", async (req, res, next) => {
    call("createUnicorn", { ...req.body }, res, next);
  });

  app.patch("/:unicorn_id", async (req, res, next) => {
    const { unicorn_id } = req.params;
    call("updateUnicorn", { unicorn_id, ...req.body }, res, next);
  });

  app.delete("/:unicorn_id", async (req, res, next) => {
    const { unicorn_id } = req.params;
    call("deleteUnicorn", unicorn_id, res, next);
  });
  return app;
};
