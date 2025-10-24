export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {

        this.delimiter = (delimiter ?? DEFAULT_DELIMITER);
        this.components = other.slice();
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method (query)
    public asString(delimiter: string = this.delimiter): string {
        
        let humanReadableComponents = [];
        for (let component of this.components) {
           humanReadableComponents.push(this.unmaskComponent(component, this.delimiter));
        }
        return humanReadableComponents.join(this.delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    // @methodtype conversion-method (query)
    public asDataString(): string {

        if (this.delimiter != DEFAULT_DELIMITER) {
            let machineReadableComponents = [];
            for (let component of this.components) {
            machineReadableComponents.push(this.maskComponent(this.unmaskComponent(component, this.delimiter), DEFAULT_DELIMITER));
            }
            return machineReadableComponents.join(this.delimiter);
        }
        return this.components.join(this.delimiter);
    }

    // @methodtype get-method (query)
    public getComponent(i: number): string {

        if (!this.isValidatIndex(i))
            throw new Error("Invalid index");

        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method (mutation)
    public setComponent(i: number, c: string): void {

        if (!this.isValidatIndex(i))
            throw new Error("Invalid index");

        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     // @methodtype get-method (query)
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method (mutation)
    public insert(i: number, c: string): void {
        
        if (!this.isValidatIndex(i))
            throw new Error("Invalid index");

        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method (mutation)
    public append(c: string): void {

        this.components.push(c);
    }

    // @methodtype command-method (mutation)
    public remove(i: number): void {
        
        if (!this.isValidatIndex(i))
            throw new Error("Invalid index");

        this.components.splice(i, 1);
    }

    // @methodtype helper-method
    private maskComponent(component: string, delimiter: string): string {

        let masked = "";
        for (let char of component) {
            if (char === ESCAPE_CHARACTER || char ===delimiter) {
                masked += ESCAPE_CHARACTER;
            }
            masked += char;
        }
        return masked;
    }

    // @methodtype helper-method
    private unmaskComponent(component: string, delimiter: string): string {
        let unmasked = "";

        for (let i = 0; i < component.length; i++) {
            const char = component[i];
            if (char === ESCAPE_CHARACTER) {
                unmasked += component[i+1];
                i++;
            } else {
                unmasked += char;
            }
        }

        return unmasked
    }

    // @methodtype boolean-query-method (query)
    private isValidatIndex(index: number): boolean {

        if (!Number.isInteger(index)) 
            return false;

        if (index < 0 || index >= this.components.length)
             return false;

        return true;
    }

}