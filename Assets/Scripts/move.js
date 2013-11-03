function Update () {
	var moveUp : Vector3;
	var moveDown : Vector3;
	var moveRight : Vector3;
	var moveLeft : Vector3;
	moveUp = Vector3.up;
	moveDown = Vector3.down;
	moveLeft = Vector3.left;
	if(Input.GetKey(KeyCode.UpArrow)){
		transform.Translate(moveUp*200*Time.deltaTime);
	}
	if(Input.GetKey(KeyCode.DownArrow)){
		transform.Translate(moveDown*300*Time.deltaTime);
	}
	if(Input.GetKey(KeyCode.LeftArrow)){
		transform.Translate(-moveLeft*1000*Time.deltaTime);
	}
}