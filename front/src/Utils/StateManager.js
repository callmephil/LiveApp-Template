export const arrayOfObjectsManager = (_this, list, targetName, primaryKey, _isMounted) => {
  const handleStateUpdate = (id, data) => {
    const newList = list.map(el =>
      el[primaryKey] === id ? { ...el, ...data } : el
    );
    if (_isMounted)
      return !_this ? newList : _this.setState({ [targetName]: newList });
  };

  const handleStateCreate = (id, data, optionals) => {
    const newList = [...list, { [primaryKey]: id, ...data, ...optionals }];
    if (_isMounted)
      return !_this ? newList : _this.setState({ [targetName]: newList });
  };

  const handleStateDelete = id => {
    const result = list.filter(data => data[primaryKey] !== id);
    if (_isMounted)
      return !_this ? result : _this.setState({ [targetName]: result });
  };

  const handleStateGet = id => {
    const result = list.find(data => data[primaryKey] === id);
    if (_isMounted)
      return !_this ? result : _this.setState({ [targetName]: result });
  };

  const handleStateUoC = (id, data) => {
    const newList = list;
    const isIndex = list.findIndex(el => el[primaryKey] === id)
    if (isIndex >= 0)
      newList[isIndex] = { ...newList[isIndex], ...data }
    else {
      newList.push({ [primaryKey]: id, ...data })
    }
    // return !_this ? newList : _this.setState({ [targetName]: newList });
    return newList;
  }

  return {
    handleStateUpdate,
    handleStateCreate,
    handleStateDelete,
    handleStateGet,
    handleStateUoC
  };
};


// export const ArrayManager = (_this) => { }
// export const ObjectManager = (_this) => { }