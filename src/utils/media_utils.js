export default class MediaUtils {
  /** Divide una cadena en partes iguales **/
  static divider_string(str, num_partes) {
    let slong = str.length;
    let long_partes = parseInt(slong / num_partes);
    let sobrante = slong % num_partes;
    let i = 0;
    let start = 0;
    let arr2 = [];
    while (i < num_partes) {
      if (i < slong) {
        let offset = sobrante > 0 ? long_partes + 1 : long_partes;
        arr2[i] = str.substr(start, offset);
        start += offset;
        sobrante--;
      } else {
        arr2[i] = "";
      }
      i++;
    }
    return arr2;
  }
  /** Une los fragemntos de cadena en uno solo **/
  static get_string_storage(num_partes, name_key_storage) {
    var stringPaste = "";
    for (var i = 0; i < num_partes; i++) {
      stringPaste += localStorage.getItem(`${name_key_storage}${i}`);
    }
    return stringPaste;
  }

  /** Crea los fragemntos de cadena en local Storage**/
  static set_string_storage(array_slice_string, name_key_storage) {
    for (var i = 0; i < array_slice_string.length; i++) {
      localStorage.setItem(`${name_key_storage}${i}`, array_slice_string[i]);
    }
  }

  /** Elimina los fragemntos de cadena en local Storage**/
  static remove_string_storage(num_partes, name_key_storage) {
    for (var i = 0; i < num_partes; i++) {
      localStorage.removeItem(`${name_key_storage}${i}`);
    }
  }

  /** Comprueba que exista la parte inicial del string en local Storage**/
  static validate_save_storage(name_key_storage){
    const local = localStorage.getItem(`${name_key_storage}`);
    return local? true:false;
  }
}
