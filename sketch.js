let points = [[-28,0], [-27,5], [-22,11],
[-18,12], [-15,14], [-14,18], [-14,21],[-13,24], [-11,25], [-8,24], [-8,21],
[-11,16], [-8,20], [-6,22], [-5,22], [-3,20], [-4,18], [-9,10], [-9,8], [-7,7], [-4,7],
[0,8], [5,8], [16,4],[21,-1], [23,-5], [23,-12], [26,-11], [28,-11], [28,-13],
[25,-17], [20,-18], [17,-22], [11,-24], [3,-25], [1,-24], [1,-22], [4,-20], [5,-20],
[-2,-18], [-3,-18], [-6,-22], [-8,-22], [-9,-21], [-10,-23], [-13,-24], [-16,-24],
[-17,-23], [-16,-21], [-13,-19], [-13,-17], [-17,-13], [-20,-7], [-19,-6], [-25,-5],
[-27,-4], [-28,-2],[-28,0], [-27,5], [-22,11]]

var stroke_colors = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)
var fill_colors = "fec5bb-fcd5ce-fae1dd-f8edeb-e8e8e4-d8e2dc-ece4db-ffe5d9-ffd7ba-fec89a".split("-").map(a=>"#"+a)

//粒子、類別
class Obj{
  constructor(args){ //預設值，基本資料(包含有物件的顏色，位置，大小...)
    //this.p = args.p || {x:random(width),y:random(height)}
    this.p = args.p || createVector(random(width),random(height)) //向量
    //this.v= {x:random(-1,1),y:random(-1,1)}
    this.v= createVector(random(-1,1),random(-1,1)) //產生一個x軸座標值為random(-1,1)，y軸座標值為random(-1,1)
    this.size= random(1,3)
    this.color= random(fill_colors)
    this.stroke= random(stroke_colors)
  }
  draw() //把物件畫出來的函數
  {
    push()
      translate(this.p.x,this.p.y)
      scale((this.v.x<0?1:-1),-1) //放大縮小的指令，this.v.x<0?1:-1 ==> this.v.x<0條件成立的話，則值為1，否則為-1             
      fill(this.color)
      stroke(this.stroke)
      strokeWeight(2)
      beginShape()
      for(var i=0;i<points.length-1;i=i+1){
        //line(points[i][0]*this.size,points[i][1]*this.size,points[i+1][0]*this.size,points[i+1][1]*this.size)
      vertex(points[i][0]*this.size,points[i][1]*this.size)
      }
      endShape()
    pop()
  }

  update(){  //移動後設定位置資料值為何

//移動的程式碼++++++++++++++++++++++++++++++++
    // this.p.x = this.p.x + this.v.x
    // this.p.y = this.p.y + this.v.y
    this.p.add(this.v)  //此行的效果跟上面兩行一樣，add為向量加法

//算出滑鼠位置的向量

let mouseV = createVector(mouseX,mouseY)  //把目前滑鼠位置轉換成向量值
//let delta = mouseV.sub(this.p).limit(3)  //delta值紀錄與滑鼠方向移動的"單位"距離，sub為向量減法，limit為每次移動單位距離
let delta = mouseV.sub(this.p).limit(this.v.mag()*2)  //與原本物件速度有關，this.v.mag()==>取得物件的速度值
this.p.add(delta)

//碰壁的處理程式碼++++++++++++++++++++++++++++++++
    if(this.p.x<=0 || this.p.x>=width)
  {
    this.v.x=-this.v.x
  }
  if(this.p.y<=0 || this.p.y>=height)
  {
    this.v.y=-this.v.y
  }
  } 
  isBallInRanger(x,y){   //判斷有沒有被滑鼠按到
    let d = dist(x,y,this.p.x,this.p.y)
    if(d<this.size*4){  //4的由來:去看座標點最大的值，以此作為被點選方框的高與寬
      return true   //代表距離有在範圍內
    }else{
      return false  //代表距離沒有在範圍內
    }
  }
}

class Bullet{
  constructor(args){ //預設值，基本資料(包含有物件的顏色，位置，大小...)
    this.r = args.r || 25 //如果飛彈有傳回直徑的大小，就以參數為直徑，否則預設為10
    this.p = args.p || createVector(width/2,height/2) //飛彈起始的位置(以向量方式表示該座標)，要以中間砲台發射，所以座標為()
    this.v = args.v || createVector(mouseX-width/2,mouseY-height/2).limit(2) //飛彈速度
    this.color= args.color || "#e76f51" //飛彈顏色
  }
  draw(){  //劃出飛彈
    push()
      translate(this.p.x,this.p.y)
      fill(this.color)
      noStroke()
      ellipse(0,0,this.r)
      //rectMode(CENTER)
      //rect(0,0,20,40)
      //triangle()
    pop()
  }
  update(){  //計算移動後的位置
    this.p.add(this.v)

  }
}
var ball  //代表單一個物件，利用這個變數來做正在處理的物件
var balls=[]
var bullet
var bullets = []
var score=0

function setup(){  //設定大象倉庫內的資料
  createCanvas(windowWidth,windowHeight)
  for (var j=0;j<20;j=j+1){
    ball = new Obj({})  //產生一個新物件，"暫時"放在ball中
    balls.push(ball)  //把ball物件放入到balls物件倉庫(陣列)中
  }
}

function draw(){  //每秒執行60次
  background(220); 
  //for(var k=0;k<balls.length;k=k+1){
  //  ball = balls[k]
  //  ball.draw()
  //  ball.update()
  //}

for(let ball of balls){  //針對陣列變數
  ball.draw()
  ball.update()
  for(let bullet of bullets){
    if(ball.isBallInRanger(bullet.p.x,bullet.p.y))
    {
      score = score + 1
      balls.splice(balls.indexOf(ball),1)
      bullets.splice(bullets.indexOf(bullet),1)
    }
}
}

for (let bullet of bullets){  //針對飛彈倉庫內的資料，一筆一筆顯示出來
  bullet.draw()
  bullet.update()
  //由此判斷，每隻大象有沒有接觸每個飛彈
 
}

textSize(50)
text(score,50,50)

push()
  let dx = mouseX-width/2
  let dy = mouseY-height/2
  let angle = atan2(dy,dx)

  translate(width/2,height/2)
  rotate(angle)
  noStroke()
  fill("#ffc03a")
  triangle(50,0,-25,-25,-25,25)
pop()
//+++++++++++++++++++++++++++++++++++++++
}

function mousePressed(){
  //+++++++++++++++++++++++++++++++++++++++++++++++
  //按下滑鼠產生一個物件程式碼
  //ball = new Obj({
  //  p:{x : mouseX, y : mouseY}
  //}) //產生一個新的物件，"暫時"放在ball變數中
  //balls.push(ball)
  //+++++++++++++++++++++++++++++++++++++++++++++++++
  // for(let ball of balls){
  //   if (ball.isBallInRanger(mouseX,mouseY)){
//       //把倉庫的這個物件刪除
//       score = score + 1
//       balls.splice(balls.indexOf(ball),1)  //把倉庫內的第幾個刪除，只刪除第1個(indexOf()找出ball的編號)
//     }
// }
bullet = new Bullet({
  r:random(10,30),
  color:random(stroke_colors)
})
bullets.push(bullet)


}