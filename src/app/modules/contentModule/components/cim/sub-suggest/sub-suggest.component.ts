import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContentItemMessageSubstitution } from 'services/content-item.service';
import { isNgContainer } from '@angular/compiler';

@Component({
  selector: 'app-sub-suggest',
  templateUrl: './sub-suggest.component.html',
  styleUrls: ['./sub-suggest.component.css']
})
export class SubSuggestComponent implements OnInit {
  @Input() substitutions: ContentItemMessageSubstitution[] = [];
  @Input() text = '';
  @Output() updateText = new EventEmitter<string>();

  showSuggestions = false;
  subsToShow: ContentItemMessageSubstitution[] = [];
  currentlySelected = '';

  constructor() { }

  ngOnInit() {
  }

  public keyPress(event: KeyboardEvent) {
    // Has delete or a letter been pressed
    if (event.keyCode === 8 || event.keyCode >= 48) {
      // A character key has been pressed
      let currentText = this.text;
      if (event.keyCode === 8) {
        currentText = currentText.substring(0, currentText.length - 1);
      } else {
        currentText += event.key;
      }

      const lastWord = this.getTheLastWord(currentText);
      this.evaluate(lastWord);
      //console.log('[SUBSUGGEST] Word', lastWord);
    } else {
      //console.log('[SUBSUGGEST] Special character pressed', event.keyCode);
      // Up down arrows pressed
      if (this.showSuggestions && event.keyCode === 38 || event.keyCode === 40) {
        // Go up and down the list of suggestions
        event.preventDefault();
        this.selectSuggestion(event.keyCode);
      }

      // Enter pressed
      if (this.showSuggestions && event.keyCode === 13 && this.currentlySelected !== '') {
        // Select an item from the list
        //console.log('[SUBSUGGEST] Select from list');
        event.preventDefault();

        // Select the suggestion
        const updatedText = this.replaceLastWord(`{${this.currentlySelected}}`);
        this.updateText.emit(updatedText);
        this.reset();
      }
    }
  }

  selectSuggestion(keyCode: number): any {
    let currentIndex = -1;
    if (this.currentlySelected !== '') {
      currentIndex = this.subsToShow.findIndex(s => s.name === this.currentlySelected);
    }

    if (keyCode === 38) {
      // Up
      currentIndex--;
    } else {
      // Down
      currentIndex++;
    }

    // Select
    //console.log('[SUBSUGGEST] Select', currentIndex);
    if (currentIndex >= 0 && currentIndex < this.subsToShow.length) {
      this.currentlySelected = this.subsToShow[currentIndex].name;
    } else {
      this.currentlySelected = '';
    }
    //console.log('[SUBSUGGEST] Selected', this.currentlySelected);
  }


  reset(): any {
    this.subsToShow = [];
    this.showSuggestions = false;
    this.currentlySelected = '';
  }


  evaluate(word: string): any {
    if (!word) { return; }
    //console.log('[SUBSUGGEST] Checking', word);

    // Is this a substitution
    if (word.startsWith('{')) {
      if (word === '{') {// Show all subs
        this.subsToShow = this.substitutions;
      } else {
        // Show matching subs
        this.subsToShow = this.substitutions.filter(s => s.name.startsWith(word.substring(1)));
      }
    } else {
      // Not a substituion word
      this.reset();
    }

    // Show the subs if there is a list to show
    this.showSuggestions = this.subsToShow.length > 0;
  }

  private getTheLastWord(text: string): string {
    let lastWord = '';
    if (text.length > 0) {
      const lastSpaceIndex = this.text.lastIndexOf(' ');
      if (lastSpaceIndex != -1 && lastSpaceIndex != text.length) {
        // There are letters after the last space
        lastWord = text.substring(lastSpaceIndex + 1);
      } else {
        lastWord = text.trim();
      }
    }
    return lastWord.trim();
  }

  replaceLastWord(newWord: string): string {
    const lastSpaceIndex = this.text.lastIndexOf('{');
    let newText = this.text.substring(0, lastSpaceIndex);
    newText += newWord;

    return newText;
  }

}
