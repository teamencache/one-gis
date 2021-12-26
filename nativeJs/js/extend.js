
function SupType() {
    this.supProperty = true;
    this.name = 'SupType';
}
SupType.prototype.getSupValue = function () {
    return this.supProperty
}
// 原型链继承
function SubType() {
    this.subProperty  = false;
}
SubType.prototype = new SupType();
SubType.prototype.constructor = SubType;
SubType.prototype.getSubValue = function () {
    return this.subProperty;
}
SubType.prototype.getName=function () {
    return this.name;
}
const instance = new SubType();
console.log(instance);
/**
 * 优点：
简单易于实现，父类的新增的实例与属性子类都能访问
缺点：
可以在子类中增加实例属性，如果要新增加原型属性和方法需要在new 父类构造函数的后面
无法实现多继承
创建子类实例时，不能向父类构造函数中传参数
 */

// 2.借用构造函数继承（伪造对象、经典继承）
function People(name){
    //属性
    this.name  = name || Annie
    //实例方法
    this.sleep=function(){
      console.log(this.name + '正在睡觉')
    }
  }
  //原型方法
  People.prototype.eat = function(food){
    console.log(this.name + '正在吃：' + food);
  }