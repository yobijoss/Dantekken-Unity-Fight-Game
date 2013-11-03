    private var step:float = 5;
    //var leftKey = "z";
    //var rightKey = "x";
    var leftKey = "a";
    var rightKey = "d";
     
    function Update(){
     
    if (Input.GetKey(leftKey))
    transform.position.x -= (step*Time.deltaTime)*0.5;
    if (Input.GetKey(rightKey))
    transform.position.x += step*Time.deltaTime*0.5;    
	}    
	
    
     
    /*if (Input.GetAxis("Horizontal"));
    transform.position.x -= step*Time.deltaTime;
    if (Input.GetAxis("Vertical"));
    transform.position.x += step*Time.deltaTime;
    }*/