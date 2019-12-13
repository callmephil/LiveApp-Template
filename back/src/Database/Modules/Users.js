import { executeToDatabase } from "./PreparedStatement";

const initializeUsers = async stmtTable => {
  try {
    const {
      USER_SEL_ID,
      USER_SEL_ALL,
      USER_INS,
      USER_UPD,
      USER_DEL
    } = stmtTable;

    const getUser = user_id => {
      return executeToDatabase(USER_SEL_ID).SELECT(user_id);
    };

    const getAllUsers = () => {
      return executeToDatabase(USER_SEL_ALL).SELECT_ALL();
    };

    const createUser = props => {
      return executeToDatabase(USER_INS).INSERT(props);
    };

    const updateUser = ({ user_id, ...props }) => {
      return executeToDatabase(USER_UPD).UPDATE(user_id, props);
    };

    const deleteUser = user_id => {
      return executeToDatabase(USER_DEL).DELETE(user_id);
    };

    const controller = {
      getUser,
      getAllUsers,
      createUser,
      updateUser,
      deleteUser
    };

    return controller;
  } catch (e) {
    console.log(`initializeUsers ${e}`);
  }
};

export default initializeUsers;
