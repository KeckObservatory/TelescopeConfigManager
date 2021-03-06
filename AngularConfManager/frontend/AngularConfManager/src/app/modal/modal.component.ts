import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modal.service';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { CommunicationService } from '../communication.service';
import { DataService } from '../data.service';


// This file includes a Component for each modal.
// They're fairly short and pretty much the same.

@Component({
    selector: 'add-modal-content',
    templateUrl: './add-modal.component.html',
})
export class AddModalContent {
    @Input() showAdd:boolean;
    @Input() order:any[] = [];

    private _current:any = {};

    // function activates when current is set - it adds default values
    @Input( 'current' ) set current ( current: any ) {
        this._current = current;
        this.order = current.order;
        let temp_info = {};

        // uncomment for sanity check. I hate TypeScript
        //if (this.showAdd == false) { console.log("false")} else {console.log("not false")}
        //if (this.showAdd == true) { console.log("true")} else {console.log("not true")}

        if (this.showAdd != true) {
            //  edit
            this._current.configurations.forEach(conf => {
                //console.log(conf,conf.id,this._current.id)
                if (conf.id == this._current.id) {
                    temp_info["id"] = this._current.id;
                    for (let key of this.order) {
                        temp_info[key[1]] = conf[key[1]];
                    }
                }
            });
       }

       this._current.info = temp_info;
       //console.log(JSON.parse(JSON.stringify(this._current)));
    }

    constructor(public activeModal: NgbActiveModal,
                private http:CommunicationService,
                private sharedCurrent:DataService) {}

    async addConfiguration() {
        let response = await this.http.addConfiguration(this._current);
        // this.sharedCurrent.set(response);
        this.activeModal.dismiss('Cross click');
    }

    async updateConfiguration() {
        let response = await this.http.updateConfiguration(this._current);
        // this.sharedCurrent.set(response);
        this.activeModal.dismiss('Cross click');
    }
}


@Component({
    selector: 'login-modal-content',
    templateUrl: './login-modal.component.html',
})
export class LoginModalContent {

    constructor(public activeModal: NgbActiveModal) {}

}

@Component({
    selector: 'delete-modal-content',
    templateUrl: './delete-modal.component.html',
})
export class DeleteModalContent {

    // function activates when current is set - it adds default values
    @Input() _current;

    constructor(public activeModal: NgbActiveModal,
                private http:CommunicationService) {}

    async deleteConfiguration() {
        let response = this.http.addConfiguration(this._current)
        this.activeModal.dismiss('Cross click');
    }

}



@Component({
    selector: 'app-modal',
    template: '<div></div>',
    styleUrls: ['./add-modal.component.css']

})
export class ModalComponent implements OnInit {

    closeResult: string;
    showAdd:boolean;
    current:any={};
    editID:string="";

    constructor(private modal:ModalService, private ngbModal:NgbModal ) { }

    ngOnInit() {
        this.modal.popup.subscribe(msg => {
          // console.log(msg)
            if (msg.data.name === "add") {
                if (msg.cmd === "show") {
                //console.log("msg show", JSON.parse(JSON.stringify(msg)));
                    this.current = msg.data.data.current;
                    this.showAdd = msg.data.data.showAdd;
                    //console.log("this.current: ", this.current);

                    // for whatever reason, TypeScript won't accept
                    // setting a property to {}. it just doesn't do it.
                    if (this.showAdd) {
                        // delete this.current.info;
                        // this.current.info={"Configuration Name": ""};
                        // console.log("post loop", this.current.info)
                    }
                    else {
                        this.current.id = msg.data.data.id;
                      // console.log(this.current.id,msg.data.data.id)
                    }

                  // console.log("opening modal")
                    this.openAddModal();
                }
            }

            else if (msg.data.name === "login") {
                if (msg.cmd === "show") {
                    this.openLoginModal();
                }
            }

            else if (msg.data.name === "delete") {
                if (msg.cmd === "show") {
                    this.current = msg.data.data.current;

                    this.openDeleteModal();
                }
            }
        })
    }

    openAddModal() {
        //console.log("open modal", JSON.parse(JSON.stringify(this.current)));
        let modalRef = this.ngbModal.open(AddModalContent);
        modalRef.componentInstance.showAdd = new Object(this.showAdd);

        // current needs to be passed last so the other things are defined
        // when it gets there for the default function
        modalRef.componentInstance.current = new Object(this.current);

        //console.log("finish open modal", JSON.parse(JSON.stringify(this.current)));

    }

    openLoginModal() {
        // just needs to open it - user will be directed away because of
        // lack of permissions
        const modalRef = this.ngbModal.open(AddModalContent);
    }


    openDeleteModal() {
        const modalRef = this.ngbModal.open(AddModalContent);
        modalRef.componentInstance.showAdd = this.showAdd;

        // current needs to be passed last so the other things are defined
        // when it gets there for the default function
        // console.log(this.current);
        modalRef.componentInstance.current = this.current;

    }

}
