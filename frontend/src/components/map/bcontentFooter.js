import React from "react";

const BContentFooter = ({i, editPlacemark, delitePlacemark}) => {
  return (<div>Ваше событие! <br/><a href="#" onClick={(e) => editPlacemark(e, i)}>Редактировать</a> <a href="#" onClick={(e) => delitePlacemark(e, i)}>Удалить</a></div>)
}

export default BContentFooter;