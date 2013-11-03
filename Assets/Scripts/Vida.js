var HP : float = 100;
function Update () {
	this.guiText.text = HP.ToString();
}
function OnGUI () {
	GUI.Label (Rect (25, 25, 100, 30), "label");
}