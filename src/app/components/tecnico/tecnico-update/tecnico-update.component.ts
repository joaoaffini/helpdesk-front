import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tecnico } from 'src/app/models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { TecnicoService } from 'src/app/services/tecnico.service';


@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(private service: TecnicoService,
              private toast: ToastrService,
              private route: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tecnico.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.findById();
  }

  possuiPerfil(perfil: any): boolean {
    return this.tecnico.perfis.includes(this.getStringPerfil(perfil));
  }

  private getStringPerfil(perfil: any): string {
    if(perfil == 0) {
      return "ADMIN";
    } else if(perfil == 1) {
      return "CLIENTE";
    } else {
      return "TECNICO";
    }
  }

  private getPerfilInteger(perfis: any[]): string[] {
    const perfisInt: string[] = [];
    if(perfis.includes("ADMIN")) {
      perfisInt.push('0');
    } 
    if(perfis.includes("CLIENTE")) {
      perfisInt.push('1');
    } 
    if(perfis.includes("TECNICO")) {
      perfisInt.push('2');
    }
    return perfisInt;

  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      this.tecnico = resposta;
    })
  }

  validaCampos() {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }

  update(): void {
    const tecnicosInt = this.getPerfilInteger(this.tecnico.perfis);

    this.tecnico = {...this.tecnico, perfis: tecnicosInt};
    console.log(tecnicosInt)
    this.service.update(this.tecnico).subscribe(() => {
      this.toast.success('Técnico atualizado com sucesso', 'Atualização');
      this.route.navigate(['tecnicos']);
    },
    ex => {
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }

  addPerfil(perfil: any) {

    if(this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }

}
