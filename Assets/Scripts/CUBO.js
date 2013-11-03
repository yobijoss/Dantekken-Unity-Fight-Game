var Barra : GUITexture;
var HP :float = 10;
var v90 : Texture2D; 
var v80 : Texture2D; 
var v70 : Texture2D; 
var v60 : Texture2D; 
var v50 : Texture2D; 
var v40 : Texture2D; 
var v30 : Texture2D; 
var v20 : Texture2D; 
var v10 : Texture2D; 
var p : combinacion_trejo_caballo;
var p1 : combinacion_movimientos;
var puntuacion : int;

function Update(){ 

    if (HP == 9){
    Barra.texture=v90;
     }
     else if(HP==8){
     Barra.texture=v80;
     }
     else if(HP==7){
     Barra.texture=v70;
     }
     else if(HP==6){
     Barra.texture=v60;
     }
     else if(HP==5){
     Barra.texture=v50;
     }  
     else if(HP==4){
     Barra.texture=v40;
     }
     else if(HP==3){
     Barra.texture=v30;
     }
     else if(HP==2){
     Barra.texture=v20;
     }
     else if(HP==1){
     Barra.texture=v10;
     }
     
     else if(HP == 0){
     Destroy(this.gameObject);
	 Application.LoadLevel("STAGE2");
	 }
   }


//Funcion para colison del contrincante   
   
   function OnCollisionEnter(obj_colision : Collision){
   
   if((obj_colision.gameObject.name == "esfera")){
		puntuacion+=100;
		HP = HP-1;
	}
	   
	if((obj_colision.gameObject.name == "manoIzqTrejo" || obj_colision.gameObject.name == "manoDerTrejo"|| obj_colision.gameObject.name == "pieDerTrejo"|| obj_colision.gameObject.name == "pieIzqTrejo") && p.Atac()){
    
	if(p.Atacnormal() && !p1.Defensa()){
		puntuacion+=100;
		HP = HP-1;
		}
	if(p.Ataccombo() && !p1.Defensa()){
		puntuacion+=300;
		HP = HP-1;
	}
 
  }
 }