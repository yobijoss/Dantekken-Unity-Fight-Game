//////////////////////////////////////////////////////////////////////////
//Script que muestra el funcionamiento de los controles, 
//en este script se controla el movimiento y color de un punto
//llamado p, esta variable es una GUITexture y el script requiere
//de ser asignado a una GUITexture para su funcionamiento,
//
//En el juego la variable p se cambiara por un personaje y 
//el script controlara el comportamiento de este eprsonaje.
//
//Los movimientos del punto p son:
//	arriba
//	abajo
//	izquierda
//	derecha
//
//La funcion de cada boton simboliza lo siguiente:
//	golpe - golpe del personaje (el punto cambia a color rojo)
//	patada - patada del personaje (el punto cambia a color azul)
//	defensa - estado defensivo del personaje (el punto cambia a ser transparente)
//
//	golpe(X3) - combo1 del personaje (el punto cambia a color verde)
//	patada(X3) - combo2 del personaje (el punto cambia a color negro)
//	patada, golpe(X2) - combo3 del personaje (el punto cambia a color blanco)
//
//	En los hadokens el punto cambia a color blanco
//	abajo, adelante, golpe - hadoken1, ataque especial 1 del personaje
//	abajo, atras, patada - hadoken2, ataque especial 2 del personaje
////////////////////////////////////////////////////////////////////

#pragma strict

@script RequireComponent( GUITexture )
var defensa : Boton;					//Boton de defensa
var golpe : Boton;						//Boton de golpe
var patada : Boton;						//Boton de patada
var moveTouchPad : Joystick;			//Palanca de movimiento
var forwardSpeed : float = 4;			//Velocidad con la que el punto se mueve
var p : GUITexture;						//Punto, esta variable se cambiara por un personaje en el juego

var combo3 : boolean = false;			//Indica si el combo1 esta activo

var hadoken1 : boolean = false;			//indica si la combinacion del hadoken1 en la palanca ha sido activada
var hadoken2 : boolean = false;			//indica si la combinacion del hadoken2 en la palanca ha sido activada


var abajo : boolean = false;			//indica si la palanca ha sido accionada solo hacia abajo
										//esta variable se usa para validar la combinacion en la palanca
										//para los hadokens

var izq : boolean = false;				//indica la orientacion del personaje, izquierda (true) o derecha (false)

private var thisTransform : Transform;	//Variable que se usa para el movimiento de la particula


//Secuencia de inicio del script, se inicializan algunas variables
function Start () {
	p = GetComponent(GUITexture);		//se obtiene la GUITexture del objeto al que ha sido asignado este script
	thisTransform = GetComponent( Transform );	//Se obtiene el transform del objeto al que ha sido asignado este script
	
	//Se conigura la posicion inicial del punto, se pone en medio de la pantalla
	p.pixelInset.x = Screen.width/2 - p.pixelInset.width/2 ;
	p.pixelInset.y = Screen.height/2 - p.pixelInset.height/2;
	
	//Se configura la posicion de los botones y de la palanca
	defensa.SetPos(1, 1);
	golpe.SetPos( 2, 0);
	patada.SetPos( 1, 0);
	moveTouchPad.SetPos();
	
}

//Esta funcion se manda llamar al final del juego
function OnEndGame()
{
	//desactiva la palanca y los botones cuando el juego termina 
	moveTouchPad.Disable();
	patada.Disable();
	defensa.Disable();
	golpe.Disable();

	// Se desactiva este script, por lo que no se pueden hacer mas cambios
	this.enabled = false;
}

//Esta funcion se manda llamar en cada "frame" del juego
function Update () {

	//Si el numero de toques del golpe es igual a cero singifica que ha acabado su tiempo de juntar toques
	//lo que nos permite resetear los combos
	if(golpe.tapCount==0)
	{
		combo3 = false;
	}
	
	//Si se expira el tiempo de toques de la palanca se deshabilitan los hadokens y la propiedad "abajo"
	if(moveTouchPad.GettapTimeWindow()<=0){
		hadoken1 = false;
		hadoken2 = false;
		abajo = false;
	}
	
	//Condiciones de acciones del punto (personaje)
	
	if(defensa.t) //valida si se ha tocado el boton de defensa
	{
			//estado de defensa, si esta defendiendo no puede atacar
			p.color.r = 200;
			p.color.a =.25; //la demostracion del estado de defensa consiste principalmente en esta linea, la textura se vuelve casi translucida
			p.color.b = 0;
			p.color.g = 0;
			//al presionar defensa se rompe la combinacion para los hadokens
			hadoken1 = false;
			hadoken2 = false;
	}else{
		
		p.color.a = 10; //se quita el estado de defensa, se vuelve solida de nuevo
		
		if(golpe.t) //valida se se ha tocado el boton de golpe
		{
			if (hadoken1){	//valida la combinacion del hadoken1 en la palanca
				//realiza el hadoken,
				p.color.r = 100;
				p.color.b = 100;
				p.color.g = 100;
				//deshabilita la combinacion del hadoken1
				hadoken1 = false;
				
			//en caso de no hacer hadoken
			}else if(!combo3&&golpe.tapCount==3){ //se valida el combo1, no debe estarse haciendo el combo3 y el boton de golpe debe de haberse tocado 3 veces
				//realiza combo1
				p.color.r =0;
				p.color.b = 0;
				p.color.g = 100;
				p.color.a = 255;
			}
			//en caso de no hacer hadoken, ni combo1
				//valida la condicion de combo3: patada, 2 golpes, en ese orden. LA verificacion de los tiempos es para validar el orden
			else if(patada.tapCount==1&&golpe.tapCount==2 && patada.GettapTimeWindow() < golpe.GettapTimeWindow()){ 
				//realiza combo3
				p.color.r = 200;
				p.color.b = 100;
				p.color.g = 100;
			}
			//en caso de no hacer hadoken, combo1 o combo3
			else{
				//realiza accion de golpe
				p.color.r = 200;
				p.color.b = 0;
				p.color.g = 0;
				p.color.a = 255;
				//rompe la combinacion de los hadokens
				hadoken1 = false;
				hadoken2 = false;
			}
		}
		
		if(patada.t)//valida si se acciona el boton de patada
		{
			if(hadoken2){ //valida la combinacion del hadoken1 en la palanca
				//realiza hadoken2
				p.color.r = 100;
				p.color.b = 100;
				p.color.g = 100;
				//deshabilita la combinacion del hadoken1
				hadoken2 = false;
			}
			//si no realiza hadoken2
			else if(patada.tapCount==3){ //valida la secuencia para el combo2 (tres patadas)
				//realiza combo2
				p.color.r = 0;
				p.color.b = 0;
				p.color.g = 0;
				p.color.a = 255;
			}
			//si no realiza hadoken2 ni combo2
			else{
				//realiza accion de patada
				p.color.r = 0;
				p.color.b = 255;
				p.color.g = 0;
				p.color.a = 255;
				//rompe las combinaciones de los hadokens
				hadoken1 = false;
				hadoken2 = false;
			}
		}
	}
	
	//Condiciones de movimiento
	//se crea una variable que nos indicara el movimento del punto (personaje)
	//esta variable tomara los valores de la posicion de la palanca con respecto al centro de la palanca
	var movement = thisTransform.TransformDirection( Vector3( moveTouchPad.position.x, moveTouchPad.position.y, 0 ) );
	movement.Normalize();
	
	//Se crea una variable que nos indica la posicion absoluta de la palanca,
	//que tan alejada del centro se encuentra.
	var absJoyPos = Vector2(Mathf.Abs( moveTouchPad.position.x ), Mathf.Abs( moveTouchPad.position.y  ));
	if(!izq){//validacion en la orentacion del personaje
		if ( absJoyPos.y < 0.6) //si la palanca esta muy cercana al centro respecto de y
		{
			//el personaje no se movera en y
			movement.y = 0;
			
		//valida si la palanca se encuentra exclusivamente hacia abajo, este es el inicio de secuencia pra ambos hadokens
		}else if(movement.y < 0 && absJoyPos.x < 0.6)
			abajo = true;
			
		if ( absJoyPos.x < 0.6){ // si la palanca esta muy cercana al centro respecto de x
			movement.x = 0; //el personaje no se movera en x
			
		}else if(movement.x < 0){//valida si la palanca fue accionada hacia atras
			if(abajo && movement.y == 0) // sigue la secuencia del hadoken, valida si ya fue accionado abajo y si la palanca fue accionada excusivamente la palanca hacia atras			
				hadoken2 = true;//dice que se cumple la secuencia de de la palanca para el hadoken2
		}
		//la palanca fue accionada hacia adelante
		else if(abajo && movement.y == 0) // sigue la secuencia del hadoken, valida si ya fue accionado abajo y si la palanca fue accionada excusivamente la palanca hacia adelante
			hadoken1= true;//dice que se cumple la secuencia de la palanca para el hadoken1
	
	}else//el personaje esta mirando hacia la izquierda
	//Este codigo es igual al de arriba, la diferencia es que si movement.x es negativo indca que el personaje se mueve hacia adelante
	// y si es positivo indica que se mueve hacia atras
	{
		if ( absJoyPos.y < 0.6)
		{
			movement.y = 0;
		}else if(movement.y < 0 && absJoyPos.x < 0.6)
			abajo = true;
		if ( absJoyPos.x < 0.6){
			movement.x = 0;
		}else if(movement.x < 0){
			if(abajo && movement.y == 0)
				hadoken1 = true;
		}
		else if(abajo && movement.y == 0)
			hadoken2 = true;
	}
	
	//multiplica el movimiento por la velocidad indicada
	movement*=forwardSpeed;
	Move(movement); //mueve el punto (personaje)
	
}

//Funcion que define el movimiento del punto (personaje) recibe un vector para declarar el movimiento
function Move(mov : Vector3){
	//valida si el punto esta en la orilla de la pantalla con respecto a y
	if(p.pixelInset.y <= Screen.height - p.pixelInset.height && p.pixelInset.y > 0 ){ 
		p.pixelInset.y += mov.y;//se cambia la posicion en y
	}
	//valida si el punto esta en la orilla inferior de la pantalla y la direccion del movimiento
	else if(p.pixelInset.y <= 0 && mov.y >0){
		p.pixelInset.y += mov.y;
	}
	
	//valida si el punto esta en la orilla superior de la pantalla y la direccion del movimiento
	else if(p.pixelInset.y >= Screen.height- p.pixelInset.height && mov.y<0){
		p.pixelInset.y += mov.y;
	}
	
	//valida si el punto esta en la orilla de la pantalla con respecto a x
	if(p.pixelInset.x <= Screen.width - p.pixelInset.width && p.pixelInset.x>0){
		p.pixelInset.x += mov.x;//cambia la posicion en x
	}
	
	//valida si el punto esta en la orilla izquierda de la pantalla y la direccion del movimiento
	else if(p.pixelInset.x<=0 && mov.x >0){
		p.pixelInset.x += mov.x;
	}
	//valida si el punto esta en la orilla derecha de la pantalla y la direccion del movimiento
	else if(p.pixelInset.x >= Screen.width - p.pixelInset.width && mov.x<0){
		p.pixelInset.x += mov.x;
	}
}