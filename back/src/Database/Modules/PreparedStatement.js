import { io } from "../../app";

const queryList = [
  // Users
  {
    USER_INS: `INSERT INTO users (first_name, last_name, email) VALUES ($first_name, $last_name, $email)`,
    USER_UPD: `UPDATE users SET first_name = $first_name, last_name = $last_name, email = $email WHERE user_id = @id`,
    USER_DEL: `DELETE FROM users WHERE user_id = ?`,
    USER_SEL_ID: `SELECT * FROM users WHERE user_id = ?`,
    USER_SEL_ALL: `SELECT * FROM users`,
    USER_DEL_ALL: `DELETE FROM users`
  },
  // Unicorns
  {
    UNICORN_INS: `INSERT INTO unicorns (name, age, color) VALUES ($name, $age, $color)`,
    UNICORN_UPD: `UPDATE unicorns SET name = $name, age = $age, color = $color WHERE unicorn_id = @id`,
    UNICORN_DEL: `DELETE FROM unicorns WHERE unicorn_id = ?`,
    UNICORN_SEL_ID: `SELECT * FROM unicorns WHERE unicorn_id = ?`,
    UNICORN_SEL_ALL: `SELECT * FROM unicorns`,
    UNICORN_DEL_ALL: `DELETE FROM unicorns`
  }
];

const prepareStmt = db => {
  try {
    let stmt = [];

    queryList.forEach(element => {
      for (const key in element) {
        if (element.hasOwnProperty(key)) stmt[key] = db.prepare(element[key]);
      }
    });

    return stmt;
  } catch (e) {
    console.log(`prepareStmt : ${e}`);
  }
};

const executeTransaction = (db, sqlArray) => {
  const statements = sqlArray.map(sql => db.prepare(sql));
  return db.transaction((data = {}) => {
    let result;
    for (const stmt of statements) {
      // if (stmt.reader) result = stmt.get(data);
      stmt.run(data);
    }
    return result;
  });
};

const executeToDatabase = stmt => {
  try {
    const SELECT = id => {
      return id ? stmt.get(id) : stmt.get();
    };

    const SELECT_ALL = id => {
      return id ? stmt.all(id) : stmt.all();
    };

    const SELECT_PROPS = (props, all) => {
      return all ? stmt.all({ ...props }) : stmt.get({ ...props });
    };

    const INSERT = props => {
      io.sockets.emit("onChangeData", "INSERT");
      const result = stmt.run({
        ...props
      });
      return result;
    };

    const UPDATE = (id, props) => {
      props.id = id;
      io.sockets.emit("onChangeData", "UPDATE");
      const result = stmt.run({
        ...props
      });
      return result.changes;
    };

    const DELETE = id => {
      const result = stmt.run(id);
      io.sockets.emit("onChangeData", "DELETE");
      return result.changes;
    };

    const DELETE_PROPS = props => {
      const result = stmt.run({ ...props });
      io.sockets.emit("onChangeData", "DELETE_PROPS");
      return result.changes;
    };

    const DELETE_ALL = () => {
      return stmt.run()
    }

    const INSERT_ALL = props => {
      const result = stmt.run({
        ...props
      });
      return result;
    };

    const QueryCenter = {
      SELECT,
      SELECT_ALL,
      SELECT_PROPS,
      INSERT,
      UPDATE,
      DELETE,
      DELETE_PROPS,
      DELETE_ALL,
      INSERT_ALL
    };

    return QueryCenter;
  } catch (e) {
    console.log(`preparedQueries error ${e}`);
  }
};

export { prepareStmt, executeToDatabase, executeTransaction };
