var projectile: Rigidbody; // drag your prefab here (must have a rigidbody)
var dirX = Vector3.right;  // direction X
var dirY = Vector3.up;     // direction Y
var speed: float = 10;     // bullet speed

function Update(){
    if (Input.GetButtonDown("Fire1")){
        var hadouken: Rigidbody = Instantiate(projectile, transform.position, Quaternion.identity);
        hadouken.velocity = speed * dirX; // shoot in the X direction
        Destroy (hadouken.gameObject, 0.8);
        
    }
}