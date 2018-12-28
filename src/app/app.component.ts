import { Component } from '@angular/core';
import { HistoryNumber } from './model/history-number.class';
import { TranslateService } from '@ngx-translate/core';
import { appValues } from './model/const/app-values.constant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept':  'text',
  })
};

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Wasape.ga';
	num: string;
	name: string;
	history: HistoryNumber[] = undefined;
	loading: boolean = true;
	countries: any;
	code:any;

	constructor(public translate: TranslateService, http: HttpClient) {

		translate.setDefaultLang('es');

		let numbers = localStorage.getItem("wasapega");
		this.history = numbers ? JSON.parse(numbers).map(x => new HistoryNumber(x.number, new Date(x.date), x.name)) : [];

		translate.use('es');
		setTimeout(x => this.loading = false, 500);

		http.get("assets/data/codes.json").toPromise().then(
			cs => {
				this.countries = cs;
				http.get("https://api.ipdata.co?api-key="+environment.ipdata_key).toPromise().then(
					(ipdata:any)=>this.code = this.countries.find(c=>c.code===ipdata.country_code).dial_code
				).catch();
			}
		).catch(
			e => {
				console.log("Error loading countries", e);
				this.countries = [
					{
						"name": "Argentina",
						"dial_code": "+54",
						"code": "AR"
					},
					{
						"name": "United States",
						"dial_code": "+1",
						"code": "US"
					}
				];
			}
		);

	}

	public send = () => {
		if (!this.code || this.code == "-1" || !this.num) return;
		let number = this.code.replace("+", "") + "" + this.num;
		this.writeTo(number);
		this.save(number, this.name);
		this.num = undefined;
		this.name = undefined;
	};

	public save = (num, name) => {
		let $this = this;
		this.history.push(new HistoryNumber(num, new Date(), name));
		setTimeout(x => {
			if (name)
				$this.history.forEach(h => {
					if (h.number === num && h.name !== name)
						h.name = name
				});
			localStorage.setItem("wasapega", JSON.stringify($this.history));
		}, 1);
	};

	public writeTo = (num) => {
		window.open("https://wa.me/" + num, "_blank", "noreferrer");
	};

	public clean = () => {
		localStorage.removeItem("wasapega");
		this.history = [];
	}

	set locale(locale: string) {
		this.translate.use(locale);
	}

	get historyNumbers() {
		return history && this.history.length ? this.history : undefined;
	}

	get version() {
		return appValues.VERSION;
	}
}
