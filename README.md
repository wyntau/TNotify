TNotify
=======

ios7+ style alert confirm and prompt service for angular

### Usage

1. include `tnotify.js` and `tnotify.css` in your html.
2. include `TNotify` as a angular dependence
3. inject `TNotify` in your controllers, services or something else.
4. use `TNotify.alert`, `TNotify.confirm` or `TNotify.prompt`.

### Options
- **title** => default empty, this is shown in modal title
- **text** => required when you invoke `alert` or `confirm` or `prompt`, tell user what do you want. Its best to set the text option when you invoke specific method.
- **cancelText** => cancel button text, default `取消`
- **okText** => ok button text, default `确定`
- **inputType** => the prompt input type, default `text`
- **inputPlaceHolder** => the prompt input placeholder, default empty

You can use `TNotifyProvider` to set default option via
```js
module.config(['TNotifyProvider', function(TNotifyProvider){
  TNotifyProvider.set('title', 'default Title');
  TNotifyProvider.set({
    cancelText: 'cancel',
    okText: 'good'
  });
}]);
```

### API
1. alert
    - params: String or Object. when string, the `option.text` is set.
    - return: promise.
    - example
    ```js
    TNotify.alert('alert').then(function(){
      // Your code here.
    });
    ```
2. confirm
    - params: String or Object. when string, the `option.text` is set.
    - return: promise. then callback function will get the user's confirm: `true` or `false`
    - example
    ```js
    TNotify.confirm('Do you want to cancel?').then(function(result){
      if(result === true){
        // yes
      }else if(result === false){
        // no
      }
    });
    ```
3. prompt
    - params: String or Object. when string, the `option.text` is set.
    - return: promise. the callback function will get the user's input(empty string or what the user input) when use click ok button, or get `null` when user click cancel button.
    - example
    ```js
    TNotify.prompt('input your telphone').then(function(result){
      console.log(result);
      // the result will be `null` when user click cancel button
      // the result will be what the user input or empty string
      // when user click ok button
    });
    ```

### Thanks
- The modal style is borrowed from [Framework7](https://github.com/nolimits4web/Framework7/)

### License
MIT