import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { QuestionService } from '../services/question.service';
import { QuizService } from '../services/quiz.service';
import { StatsService } from '../services/stats.service';

import { SelectedQuestion } from '../models/selectedQuestion.model';

import { addIcons } from 'ionicons';

import {
  arrowForward,
  arrowForwardCircle
} from 'ionicons/icons';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],

  standalone: true,

  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton
  ]
})


export class QuizPage {


  /*
   * PREGUNTA ACTUAL
   */
  question: any = null;


  /*
   * LISTA DE PREGUNTAS DEL QUIZ
   */
  pool: any[] = [];


  /*
   * RESPUESTA
   */
  showAnswer = false;

  index = 0;

  answered = false;

  selected = '';


  /*
   * TÍTULO
   */
  modeTitle = '';

  sourceTitle = '';


  /*
   * CONTROL DE USADAS
   */
  trackUsed = true;


  /*
   * TOTAL
   */
  totalQuestions = 0;


  constructor(

    private qs: QuestionService,

    private quiz: QuizService,

    private route: ActivatedRoute,

    private router: Router,

    private statsService: StatsService

  ) {

    addIcons({

      arrowForwardCircle,

      arrowForward

    });

  }


  /*
   * =========================================================
   * ENTRAR EN EL QUIZ
   * =========================================================
   */

  async ionViewWillEnter() {


    /*
     * Limpiar estado anterior
     */

    this.question = null;

    this.pool = [];

    this.index = 0;

    this.answered = false;

    this.selected = '';

    this.showAnswer = false;

    this.trackUsed = true;

    this.modeTitle = '';

    this.sourceTitle = '';


    /*
     * =======================================================
     * QUIZ PERSONALIZADO
     * =======================================================
     *
     * Puede venir desde:
     *
     * - Hoy
     * - Estadísticas
     * - preguntas seleccionadas
     *
     */

    const questions: SelectedQuestion[] =
      history.state?.questions || [];


    if (questions.length > 0) {


      console.log(
        'QUIZ PERSONALIZADO'
      );


      /*
       * Cargamos todo
       */

      const all =
        await this.qs.getCombined();


      /*
       * Filtramos por:
       *
       * TEMA
       * FUENTE
       * ID
       *
       * Esto es MUY IMPORTANTE.
       */

      this.pool =
        all.filter(q =>

          questions.some(sel =>

            sel.id === q.id &&

            sel.type === q.type &&

            sel.source === q.source

          )

        );


      this.trackUsed = false;

      this.modeTitle =
        'Quiz personalizado';


      this.sourceTitle =
        'Preguntas seleccionadas';

    }


    /*
     * =======================================================
     * QUIZ NORMAL
     * =======================================================
     */

    else {


      const mode =
        this.route.snapshot
          .queryParamMap
          .get('mode');


      const source =
        this.route.snapshot
          .queryParamMap
          .get('source') || 'all';


      console.log(
        '=============================='
      );


      console.log(
        'MODO:',
        mode
      );


      console.log(
        'FUENTE:',
        source
      );


      console.log(
        '=============================='
      );


      /*
       * =====================================================
       * TEMA
       * =====================================================
       */

      if (
        mode &&
        mode.startsWith('tema')
      ) {


        console.log(
          'Cargando tema:',
          mode
        );


        console.log(
          'Cargando fuente:',
          source
        );


        /*
         * AQUÍ SE CARGA:
         *
         * examen-2022.json
         * bateria-2026.json
         * chatgpt.json
         *
         * según source.
         *
         * Si chatgpt.json no existe,
         * QuestionService lo ignora.
         */

        this.pool =
          await this.qs.getTema(
            mode,
            source
          );


        /*
         * TÍTULO DEL TEMA
         */

        this.modeTitle =
          mode.replace(
            'tema',
            'Tema '
          );


        /*
         * TÍTULO DE FUENTE
         */

        if (
          source === 'examen-2022'
        ) {

          this.sourceTitle =
            'Examen 2022';

        }

        else if (
          source === 'bateria-2026'
        ) {

          this.sourceTitle =
            'Batería 2026';

        }

        else if (
          source === 'chatgpt'
        ) {

          this.sourceTitle =
            'ChatGPT';

        }

        else {

          this.sourceTitle =
            'Todas las fuentes';

        }

      }


      /*
       * =====================================================
       * EXÁMENES INDEPENDIENTES
       * =====================================================
       */

      else if (
        mode &&
        mode !== 'combined'
      ) {


        console.log(
          'Cargando examen:',
          mode
        );


        this.pool =
          await this.qs.getExamen(
            mode
          );


        /*
         * IVAP GENERAL
         */

        if (
          mode ===
          'ivap-general-2026'
        ) {

          this.modeTitle =
            'IVAP GENERAL 2026';

        }


        /*
         * IVAP ADMINISTRATIVO
         */

        else if (
          mode ===
          'ivap-administrativo-2022'
        ) {

          this.modeTitle =
            'IVAP ADMINISTRATIVO 2022';

        }


        else {

          this.modeTitle =
            mode;

        }


        this.sourceTitle =
          'Examen';

      }


      /*
       * =====================================================
       * CONJUNTO
       * =====================================================
       */

      else {


        console.log(
          'Cargando conjunto completo'
        );


        this.pool =
          await this.qs.getCombined();


        this.modeTitle =
          'Conjunto';


        this.sourceTitle =
          'Todas las fuentes';

      }

    }


    /*
     * =======================================================
     * ESTADÍSTICAS
     * =======================================================
     */

    const stats: Record<string, any> =
      await this.statsService.getStats();


    /*
     * =======================================================
     * MEZCLAR PREGUNTAS
     * =======================================================
     */

    this.pool =
      this.pool.sort(
        () => Math.random() - 0.5
      );


    /*
     * =======================================================
     * ORDENAR POR DIFICULTAD
     * =======================================================
     *
     * CLAVE:
     *
     * tema + fuente + id
     *
     */

    this.pool =
      this.pool.sort(
        (a, b) => {


          const statA =
            stats[
              `${a.type}_${a.source}_${a.id}`
            ];


          const statB =
            stats[
              `${b.type}_${b.source}_${b.id}`
            ];


          const ratioA =
            this.statsService.getRatio(
              statA
            );


          const ratioB =
            this.statsService.getRatio(
              statB
            );


          return ratioA - ratioB;

        }
      );


    /*
     * =======================================================
     * INFORMACIÓN DE DEBUG
     * =======================================================
     */

    console.log(
      'Tema:',
      this.modeTitle
    );


    console.log(
      'Fuente:',
      this.sourceTitle
    );


    console.log(
      'Preguntas cargadas:',
      this.pool.length
    );


    console.log(
      'Primeras preguntas:',
      this.pool.slice(0, 3)
    );


    /*
     * =======================================================
     * TOTAL
     * =======================================================
     */

    this.totalQuestions =
      this.pool.length;


    this.index = 0;


    /*
     * =======================================================
     * SIN PREGUNTAS
     * =======================================================
     */

    if (
      this.pool.length === 0
    ) {


      console.warn(
        'NO HAY PREGUNTAS PARA ESTA SELECCIÓN'
      );


      /*
       * No intentamos acceder a
       * this.pool[0].
       */

      this.question = null;


      return;

    }


    /*
     * =======================================================
     * CARGAR PRIMERA PREGUNTA
     * =======================================================
     */

    await this.load();

  }


  /*
   * =========================================================
   * CARGAR PREGUNTA
   * =========================================================
   */

  async load() {


    /*
     * QUIZ PERSONALIZADO
     */

    if (
      !this.trackUsed
    ) {


      this.question =
        this.pool[this.index];

    }


    /*
     * QUIZ NORMAL
     */

    else {


      /*
       * Primera vuelta
       */

      if (
        this.index <
        this.pool.length
      ) {


        this.question =
          this.pool[this.index];

      }


      /*
       * Después de la primera vuelta
       */

      else {


        this.question =
          await this.quiz.next(
            this.pool,
            true
          );

      }

    }


    /*
     * Reset de respuesta
     */

    this.answered = false;

    this.selected = '';

    this.showAnswer = false;


    /*
     * DEBUG
     */

    console.log(
      'Pregunta actual:',
      this.question
    );

  }


  /*
   * =========================================================
   * SELECCIONAR RESPUESTA
   * =========================================================
   */

  async select(
    option: string
  ) {


    /*
     * No permitir responder dos veces
     */

    if (
      this.answered
    ) {

      return;

    }


    /*
     * Guardar respuesta seleccionada
     */

    this.selected =
      option;


    this.answered =
      true;


    /*
     * Comprobar respuesta
     */

    const correct =
      option.toUpperCase() ===
      this.question.correct
        ?.toUpperCase();


    /*
     * =======================================================
     * MARCAR COMO USADA
     * =======================================================
     */

    if (
      this.trackUsed
    ) {


      await this.quiz.markUsed(

        this.question.id,

        this.question.type,

        this.question.source

      );

    }


    /*
     * =======================================================
     * GUARDAR ESTADÍSTICA
     * =======================================================
     */

    await this.statsService.recordAnswer(

      this.question.id,

      this.question.type,

      this.question.source,

      correct

    );

  }


  /*
   * =========================================================
   * SIGUIENTE
   * =========================================================
   */

  next() {


    this.index++;


    /*
     * FIN DEL QUIZ
     */

    if (
      this.index >=
      this.totalQuestions
    ) {


      console.log(
        'Quiz terminado'
      );


      this.router.navigate(
        ['/tabs/home']
      );


      return;

    }


    /*
     * Cargar siguiente
     */

    this.load();

  }


  /*
   * =========================================================
   * CLASE DE RESPUESTA
   * =========================================================
   */

  getButtonClass(
    opt: string
  ) {


    /*
     * Todavía no ha respondido
     */

    if (
      !this.answered &&
      !this.showAnswer
    ) {

      return '';

    }


    /*
     * Respuesta correcta
     */

    if (
      opt.toUpperCase() ===
      this.question.correct
        ?.toUpperCase()
    ) {

      return 'correct';

    }


    /*
     * Respuesta que ha elegido
     * y es incorrecta
     */

    if (

      opt.toUpperCase() ===
      this.selected
        ?.toUpperCase()

      &&

      opt.toUpperCase() !==
      this.question.correct
        ?.toUpperCase()

    ) {

      return 'wrong';

    }


    return '';

  }


  /*
   * =========================================================
   * VER RESPUESTA
   * =========================================================
   */

  verRespuesta() {


    if (
      this.answered
    ) {

      return;

    }


    this.showAnswer =
      true;

  }

}