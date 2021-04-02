import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Link } from "react-router-dom";

export default class Navigation{

  static volver(path,styles) {
    return (
      <Link to={path} className={styles.linkBack}>
        <ArrowBackIosIcon className={styles.arrow} />
        Volver
      </Link>
    );
  }

  static BtnBack(props, styles) {
    if (props > 0) {
      return (
        <Link to={`/detail/${parseInt(props) - 1}`} className={styles.btnLeft}>
          <ArrowBackIosIcon  className={styles.arrow}  />
          Anterior
        </Link>
      );
    }
  }
  
  static BtnGo(props, styles, question) {
    console.log(question.length + "-" + props);
    if (props != question.length - 1) {
      return (
        <Link to={`/detail/${parseInt(props) + 1}`} className={styles.btnRight}>
          Siguiente
          <ArrowForwardIosIcon  className={styles.arrow}  />
        </Link>
      );
    }
  }
}