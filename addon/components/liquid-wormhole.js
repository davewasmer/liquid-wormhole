import Ember from 'ember';

const { A, computed, inject, observer, run } = Ember;

const { service } = inject;
const { alias } = computed;

const LiquidWormhole = Ember.Component.extend({
  to: null,
  classNames: ['liquid-wormhole-container'],

  liquidTarget: alias('to'),
  liquidTargetService: service('liquid-target'),

  nodes: computed(function() {
    if (this.element) {
      return this.$().children();
    }
  }),

  childWormholes: computed(() => A()),

  liquidTargetDidChange: observer('liquidTarget', function() {
    this.get('liquidTargetService').removeItem(this._target, this);
    this.get('liquidTargetService').appendItem(this._target, this);
  }),

  didInsertElement() {
    const parentWormhole = this.nearestOfType(LiquidWormhole);
    const liquidTargetService = this.get('liquidTargetService');

    if (parentWormhole) {
      parentWormhole.get('childWormholes').unshiftObject(this);
    } else {
      this._target = this.get('liquidTarget');

      liquidTargetService.appendItem(this._target, this);

      this.get('childWormholes').forEach((wormhole) => liquidTargetService.appendItem(wormhole._target, wormhole));
    }

    this._super.apply(this, arguments);
  },

  willDestroyElement() {
    this.get('liquidTargetService').removeItem(this._target, this);

    this._super.apply(this, arguments);
  }
});

export default LiquidWormhole;