#pragma strict

var total : int;

function Update () {

total = Puntuacion_trejo.puntuacion + puntuacion_trejo_caballo.puntuacion + puntuacion_trejo_castor.puntuacion;

this.guiText.text = "Puntuacion  total Player 1= " + total.ToString();

}

