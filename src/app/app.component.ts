import { Component } from '@angular/core';
import { HistoryNumber } from './history-number.class';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Wasape.ga';
	code:string = "54";
	num:string;
	history:HistoryNumber[] = undefined;
	loading:boolean = true;

	constructor(public translate: TranslateService) {

        translate.setDefaultLang('es');

		let numbers = localStorage.getItem("wasapega");
		this.history = numbers ? JSON.parse(numbers).map(x=>new HistoryNumber(x.number, new Date(x.date))) : [];

		translate.use('es');
		setTimeout(x=>this.loading=false,500);

	}

	public send = ()=>{
		let number = this.code.replace("+","")+""+this.num;
		this.save(number);
		this.writeTo(number);
		this.code = "54";
		this.num = undefined;
	};
	
	public save = (num) => {
		this.history.push(new HistoryNumber(num, new Date()));
		localStorage.setItem("wasapega", JSON.stringify(this.history));
	};
	
	public writeTo = (num)=>{
		window.open("https://wa.me/"+num, "_blank","noreferrer");
	};
	
	public clean = ()=>{
		localStorage.removeItem("wasapega");
		this.history = [];
	}

	set locale(locale:string){
		this.translate.use(locale);
	}
	
	get historyNumbers(){
		return history && this.history.length ? this.history : undefined;
	}
}
