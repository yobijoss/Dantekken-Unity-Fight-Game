#pragma strict

var p : Vida_trejo;
static var puntuacion : int = 0;

function Update () {

puntuacion = p.puntuacion;

this.guiText.text = "Puntuacion = " + p.puntuacion.ToString();

}