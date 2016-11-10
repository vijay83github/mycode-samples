define(function(){

  return {

    data_ : {},

    setData : function(userData){
      this.data_ = userData;
    },

    getData : function(){
      return this.data_;
    }
  };
});