#pragma strict

var total : int;

function Update () {

total = puntuacion_dantevil.puntuacion + puntuacion_caballo.puntuacion + puntuacion_castor.puntuacion;

this.guiText.text = "Puntuacion  total Player 2= " + total.ToString();

}