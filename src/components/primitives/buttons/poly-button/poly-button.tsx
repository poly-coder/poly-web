import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'poly-button',
  styleUrl: 'poly-button.styl'
})
export class PolyButton {

  @Prop() color: string = '';
  @Prop() rounded: string = '';
  @Prop() disabled: boolean = false;

  hostData() {
    return {
      'class': this.classes()
    }
  }

  classes(): any {
    return {
      'poly-button': true,
      disabled: this.disabled,
      [`text-${this.color}-fore`]: !!this.color
    }
  }
  
  bgClasses(): any {
    return {
      'poly-background': true,
      [`bg-${this.color}`]: !!this.color,
      [`rounded${this.rounded ? '-' + this.rounded : ''}`]: true
    }
  }
  
  render() {
    return [
      (<div class={ this.bgClasses() }/>),
      (<div class="poly-content">
        <slot/>
      </div>)
    ];
  }
}