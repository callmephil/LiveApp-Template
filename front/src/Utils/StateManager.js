export const arrayOfObjectsManager = (_this, list, targetName, primaryKey) => {
  const handleStateUpdate = (id, data) => {
    const newList = list.map(el =>
      el[primaryKey] === id ? { ...el, ...data } : el
    );
    console.log(newList);
    return !_this ? newList : _this.setState({ [targetName]: newList });
  };

  const handleStateCreate = (id, data, optionals) => {
    const newList = [...list, { [primaryKey]: id, ...data, ...optionals }];
    return !_this ? newList : _this.setState({ [targetName]: newList });
  };

  const handleStateDelete = id => {
    const result = list.filter(data => data[primaryKey] !== id);
    return !_this ? result : _this.setState({ [targetName]: result });
  };

  const handleStateGet = id => {
    const result = list.find(data => data[primaryKey] === id);
    return !_this ? result : _this.setState({ [targetName]: result });
  };

  return {
    handleStateUpdate,
    handleStateCreate,
    handleStateDelete,
    handleStateGet
  };
};


// export const ArrayManager = (_this) => { }
// export const ObjectManager = (_this) => { }