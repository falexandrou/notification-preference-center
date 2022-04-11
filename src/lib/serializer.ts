type ConstructorOf<T> = Function & { new(...args: any[]): T };

abstract class Serializer {
  /**
   * Serializes a model by exposing specific attributes
   *
   * @param {Object} model the model to serialize
   * @returns {Object} the serialized model
   */
  abstract serialize(model: object): object;

  /**
   * Serializes a single model
   *
   * @param {Object} model the model to serialize
   * @returns {Object} the serialized model
   */
  static model<T extends Serializer>(this: ConstructorOf<T>, model: object): object {
    const instance = new this();
    return instance.serialize(model);
  }

  /**
   * Serializes a list of models
   *
   * @param {Object[]} models the model to serialize
   * @returns {Object[]} the serialized model
   */
  static list<T extends Serializer>(this: ConstructorOf<T>, models: object[]): object[] {
    const instance = new this();
    return models.map((model) => instance.serialize(model));
  }
}

export default Serializer;
