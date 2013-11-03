#pragma strict

var p : CUBO;
static var puntuacion : int = 0;

function Update () {

puntuacion = p.puntuacion;

this.guiText.text = "Puntuacion = " + p.puntuacion.ToString();

}
