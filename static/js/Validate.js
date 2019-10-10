const Validate = {
  /*
   * @return {string}
   */
  ValidateValue(textbox) {
    console.log(textbox, '++++++++++');
    let IllegalString = "[`~!#$@%^&*()=|{}':;'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“'。·、？]‘’";
    let index = textbox.length - 1;

    let s = textbox.charAt(index);
    if (IllegalString.indexOf(s) >= 0) {
      s = textbox.substring(0, index);
      textbox = s;
      console.log(textbox, '***********');
      return textbox;
    } else {
      return textbox;
    }
  }
};
export default Validate