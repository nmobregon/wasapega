export class HistoryNumber {

	constructor(public number:string, public date:Date, public name?:string){}
	
	get tooltip(){
		return this.name ? (this.name + " (" + this.number + ")") : this.number;
	}
}