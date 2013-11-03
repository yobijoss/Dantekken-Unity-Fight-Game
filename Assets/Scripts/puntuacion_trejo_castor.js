#pragma strict

var p : VidaCastor;
static var puntuacion : int = 0;

function Update () {

puntuacion = p.puntuacion;

this.guiText.text = "Puntuacion = " + puntuacion.ToString();

}
