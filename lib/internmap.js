function keyof(k) {
  return k !== null && typeof k === "object" ? k.valueOf() : k;
}

export class InternMap extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, {
      _key: { value: key },
      _types: { value: new Map() }
    });
    if (entries != null) {
      for (const [k, v] of entries) {
        this.set(k, v);
      }
    }
  }
  get(key) {
    return super.get(this._key(key));
  }
  set(key, value) {
    return super.set(this._key(key), value);
  }
  has(key) {
    return super.has(this._key(key));
  }
  delete(key) {
    return super.delete(this._key(key));
  }
}

export class InternSet extends Set {
  constructor(values, key = keyof) {
    super();
    Object.defineProperties(this, {
      _key: { value: key },
      _types: { value: new Map() }
    });
    if (values != null) {
      for (const v of values) {
        this.add(v);
      }
    }
  }
  add(value) {
    return super.add(this._key(value));
  }
  has(value) {
    return super.has(this._key(value));
  }
  delete(value) {
    return super.delete(this._key(value));
  }
}

export default { InternMap, InternSet };
