import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { GaugeComponent } from './components/gauge/gauge.component';
import { TextComponent } from './components/text/text.component';

//directives
import { FontStyleDirective } from './directives/fontstyle.directive';
import { MoveableObjectDirective } from './directives/moveable-object.directive';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GaugeComponent,
    TextComponent,
    FontStyleDirective,
    MoveableObjectDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
