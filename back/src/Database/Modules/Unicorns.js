import { executeToDatabase } from "./PreparedStatement";

const initializeUnicorns = async stmtTable => {
  try {
    const {
      UNICORN_SEL_ID,
      UNICORN_SEL_ALL,
      UNICORN_INS,
      UNICORN_UPD,
      UNICORN_DEL
    } = stmtTable;

    const getUnicorn = unicorn_id => {
      return executeToDatabase(UNICORN_SEL_ID).SELECT(unicorn_id);
    };

    const getAllUnicorns = () => {
      return executeToDatabase(UNICORN_SEL_ALL).SELECT_ALL();
    };

    const createUnicorn = props => {
      return executeToDatabase(UNICORN_INS).INSERT(props);
    };

    const updateUnicorn = ({ unicorn_id, ...props }) => {
      return executeToDatabase(UNICORN_UPD).UPDATE(unicorn_id, props);
    };

    const deleteUnicorn = unicorn_id => {
      return executeToDatabase(UNICORN_DEL).DELETE(unicorn_id);
    };

    const controller = {
      getUnicorn,
      getAllUnicorns,
      createUnicorn,
      updateUnicorn,
      deleteUnicorn
    };

    return controller;
  } catch (e) {
    console.log(`initializeUnicorns ${e}`);
  }
};

export default initializeUnicorns;
