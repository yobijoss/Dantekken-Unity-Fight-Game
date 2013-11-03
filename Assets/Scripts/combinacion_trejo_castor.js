var Animacion: AnimationClip;
var pos : float = 1;
var golpe : Boton;						//Boton de golpe
var patada : Boton;						//Boton de patada
var hadoken : Boton;					//boton de hadoken
var DB : Boton;							//boton de dragon ball
var moveTouchPad : Joystick;			//Palanca de movimiento
var Speedm : float = 4;				//Indica la velocidad del movimiento
var combo1 : boolean = false;			//Indica si el combo1 se activo
var combo2 : boolean = false;			//Indica si el combo2 se activo
var combo3 : boolean = false;
var abajo : boolean = false;			//indica si la palanca ha sido accionada hacia abajo
var arriba : boolean = false;			//Indica si la palanca ha sido accionada hacia arriba
										//esta variable se usa para validar la combinacion en la palanca
										//para los combos//
var jumping : boolean = false;
var salto : float = 0;


var izq : boolean = false;				//indica la orientacion del personaje, izquierda (true) o derecha (false)
private var thisTransform : Transform;	//Variable que se usa para el movimiento de la particula

function Start () {

	thisTransform = GetComponent( Transform );	//Se obtiene el transform del objeto al que ha sido asignado este script
	
	//Se configura la posicion de los botones y de la palanca
	moveTouchPad.Start();
	golpe.Start();
	patada.Start();
	hadoken.Start();
	DB.Start();
	moveTouchPad.SetPos();
	hadoken.SetPos( 1, 1);
	DB.SetPos( 2, 1);
	golpe.SetPos( 1, 0);
	patada.SetPos( 2, 0);
	
	//this.animation["idle"].wrapMode = WrapMode.Loop;
}

function Update(){

// if(!this.animation.isPlaying)
	// this.animation.Play("");

if(golpe.tapCount==0)
	{
		combo1 = false;
	}

if(moveTouchPad.GettapTimeWindow()<=0){
		combo1 = false;
		combo2 = false;
		combo3 = false;
		}
		if(hadoken.t)
		{
			this.animation.Play("hadouken");
		}
		
		if(DB.t)
		{
			this.animation.Play("dragonball");
		}
		
		if(golpe.t) //valida si se ha tocado el boton de golpe
		{
						
			if(golpe.tapCount == 2){
			
			this.animation.Play("combo2");
			
			}else
				this.animation.Play("puño");
					
		 }		
		if(patada.t)//valida si se acciona el boton de patada
		{
			
			// if(golpe.tapCount == 1){
			
				// this.animation.Play("combo3");
			
			// }else	
			// if(patada.tapCount == 2){
			
				// this.animation.Play("combo1");
			
			// }
			// else
			// realiza accion de patada
				this.animation.Play("spatada");
			
		}

var movement = thisTransform.TransformDirection( Vector3( moveTouchPad.position.x*-1, moveTouchPad.position.y, 0 ) );
	movement.Normalize();
	
//Se crea una variable que nos indica la posicion absoluta de la palanca,
//que tan alejada del centro se encuentra.
var absJoyPos = Vector2(Mathf.Abs( moveTouchPad.position.x ), Mathf.Abs( moveTouchPad.position.y  ));
			
		if ( absJoyPos.x < 0.6){ // si la palanca esta muy cercana al centro respecto de x
			movement.x = 0; //el personaje no se movera en x
			
		}else if(movement.x < 0){//valida si la palanca fue accionada hacia atras
			if(abajo && movement.y == 0) // sigue la secuencia del hadoken, valida si ya fue accionado abajo y si la palanca fue accionada excusivamente la palanca hacia atras			
				combo2 = true;//dice que se cumple la secuencia de de la palanca para el combo2
		
			// la palanca fue accionada hacia adelante
			else if(abajo && movement.y == 0) // sigue la secuencia del hadoken, valida si ya fue accionado abajo y si la palanca fue accionada excusivamente la palanca hacia adelante
			combo1= true;//dice que se cumple la secuencia de la palanca para el combo1
		}
	else//el personaje esta mirando hacia la izquierda
	
	// Este codigo es igual al de arriba, la diferencia es que si movement.x es negativo indca que el personaje se mueve hacia adelante
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
				combo1 = true;
		}
		else if(abajo && movement.y == 0)
			combo2 = true;
	}
	//multiplica el movimiento por la velocidad indicada
	movement*=Speedm;
	Move(movement); //mueve el punto (personaje)
	
}

function Move(mov : Vector3){
	//valida si el punto esta en la orilla de la pantalla con respecto a y
	if(mov.y<0&&!jumping){
		if(!this.animation.IsPlaying("defensa")){
			this.animation.Play("defensa");
		}
		this.animation.CrossFadeQueued("defensa");
		mov.y = 0;
	}else{
		if(mov.y>0){
			if(!jumping){
				salto = Speedm*2;
				Saltar();
			}
		}
	}
	if(jumping){
		salto += (Physics.gravity.y + Time.deltaTime+Physics.gravity.y);
	}
	if(mov.x!=0 && !jumping){
	
		this.animation.CrossFade("caminar");
	
	}
	
	mov.y = salto;
	mov*= 2.5*Time.deltaTime;
	this.transform.Translate(mov);
	if(pos > this.transform.position.y){
		this.transform.position.y = pos;
		jumping = false;
	}
}

function Saltar(){
	jumping = true;
	this.animation.Play("saltar");
}

function Atac(): boolean{
	return (this.animation.IsPlaying("puño")||this.animation.IsPlaying("patada")||this.animation.IsPlaying("dragonball") || this.animation.IsPlaying("hadouken") || this.animation.IsPlaying("combo1") || this.animation.IsPlaying("combo2"));
}

function Atacnormal(): boolean{

	if(this.animation.IsPlaying("puño")||this.animation.IsPlaying("patada")||this.animation.IsPlaying("dragonball") || this.animation.IsPlaying("hadouken"))
		return true;
	return false;
}

function Ataccombo(): boolean{

	if(this.animation.IsPlaying("combo1")||this.animation.IsPlaying("combo2")||this.animation.IsPlaying("combo3"))
		return true;
	return false;
}

function Defensa(): boolean{

	if(this.animation.IsPlaying("defensa"))
		return true;
	return false;
}

//if(Input.GetKey(KeyCode.Z)) 
 // this.animation.Play("patada");

//if(Input.GetKey(KeyCode.LeftArrow)){
	// this.animation.Play("caminar");
	// transform.Translate(Vector3(0,0,Input.GetAxis("Horizontal"))*1*Time.deltaTime);
// }
// if(Input.GetKey(KeyCode.RightArrow)){
	// this.animation.Play("caminar");
	// transform.Translate(Vector3(0,0,Input.GetAxis("Horizontal"))*1*Time.deltaTime);
// }
//if(Input.GetKey(KeyCode.V))
//this.animation.Play("puño");

// }
// if(Input.GetKey(KeyCode.UpArrow)){
	// this.animation.Play("saltar");
	// transform.Translate(Vector3.up*1*Time.deltaTime);
// }
// if(Input.GetKey(KeyCode.DownArrow)){
	//.animation.Play("defensa");
// }

// if(Input.GetKey(KeyCode.LeftArrow)){
	// this.animation.Play("caminar");
	// transform.Translate(Vector3(0,0,-.01));
	// Input.GetAxis(("Horizontal")*1*Time.deltaTime);
// }
// if(Input.GetKey(KeyCode.RightArrow)){
	// this.animation.Play("caminar");
	// transform.Translate(Vector3(0,0,.01));
// }
// transform.Translate(Vector3(0,0,Input.GetAxis("Horizontal"))*1*Time.deltaTime);

function OnGUI () {
	if (GUI.Button (Rect (Screen.width-240, 500, Screen.width/22, Screen.width/22), "Y")) {
		this.animation.Play("puño");
	}
	if (GUI.Button (Rect (Screen.width-170, 550, Screen.width/22, Screen.width/22), "X")) {
		this.animation.Play("spatada");
	}
	if (GUI.RepeatButton (Rect (Screen.width-100, 500, Screen.width/22, Screen.width/22), "A")) {
		this.animation.Play("combo1");
	}
}