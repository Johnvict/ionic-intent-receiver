import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntentOptions, WebIntent } from '@ionic-native/web-intent/ngx';

@Component({
	selector: 'app-folder',
	templateUrl: './folder.page.html',
	styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
	public folder: string;
	intentReplyForm: FormGroup = new FormGroup({
		phone: new FormControl('', [Validators.required, Validators.pattern('[0]{1}[7-9]{1}[0-1]{1}[0-9]{8}')]),
		name: new FormControl('', [Validators.required]),
		amount: new FormControl(12000, [Validators.required]),
		paid: new FormControl(false, [Validators.required]),
		eventReference: new FormControl('', [Validators.nullValidator])
	});

	constructor(
		private webIntent: WebIntent,
	) { }

	ngOnInit() {
		//
		console.log('HEY onInit WORKS!');
		this.registerReceiver();
	}
	registerReceiver() {
		this.webIntent.registerBroadcastReceiver({
			filterActions: [
				'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION'
			]
		}).subscribe(intent => {
			if (intent.extras.exitApp) {
				console.log('APP EXITING');
				// tslint:disable-next-line:no-string-literal
				navigator['app'].exitApp();
			}
		});

		this.webIntent.getIntent()
			.then(intent => {
				this.intentReplyForm.setValue({
					...this.intentReplyForm.value,
					...intent.extras
				});
			})
			.catch(error => {
				console.log('SOME ERROR OCCURED');
				console.log(error);
			});
	}

	sendIntent() {
		console.log(this.intentReplyForm.value);
		const options: IntentOptions = {
			action: 'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION',
			package: 'com.devpitch.intent.sender',
			extras: { ...this.intentReplyForm.value }
		};

		this.webIntent.sendBroadcast(options);
		this.webIntent.sendResult({
			extras: { ...this.intentReplyForm.value }
		});
	}
}
