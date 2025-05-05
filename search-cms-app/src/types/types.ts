export interface User {
    firstName: string;
    email: string;
  }


  export interface DecodedToken {
    user: {
      firstName: string;
      email: string;
    };
    exp: number;
  }


  
  export interface DecodedToken {
    user: User;
    exp: number; // Expiration time (Unix timestamp)

    // Add other JWT claims as needed
  iat?: number;
  iss?: string;
  }
  
  export interface AuthState {
    user: User; 
    sessionToken: string;
  }


  export interface StoredUser extends User {
    sessionToken: string;
    exp: number;
  }


  export interface WebflowAPI {
    getSelectedElement: () => Promise<{
      before: (preset: any) => Promise<{
        setInnerHTML: (html: string) => Promise<void>;
        setText?: (text: string) => Promise<void>;
        append?: (child: any) => Promise<void>;
        setStyles?: (styles: WebflowStyle[]) => Promise<void>;
        getStyles?: () => Promise<Record<string, string>>;
        setHeadingLevel?: (level: 1 | 2 | 3 | 4 | 5 | 6) => Promise<void>;
        applyStyle?: (style: WebflowStyle) => Promise<void>;
        setAttribute?: (name: string, value: string) => Promise<null>; // or similar
        setCustomAttribute?: (name: string, value: string) => Promise<null>;
        setTextContent?: (text: string) => Promise<void>;
        getChildren?: () => Promise<any[]>;
        setSettings(mode: string, value: string, options?: { openInNewTab?: boolean, subject?: string | null })
        getAllElements?: () => Promise<any[]>;
        createChild
        children
        findChild
        setHtml
        setAsset
        // getAsset?: () => Promise<Asset | null>;
        addAnimation
        setHtmlContent
        addComboClass
        removeComboClass
      }>;
      append?: (child: any) => Promise<void>;
      setStyles?: (styles: WebflowStyle[]) => Promise<void>;
      getStyles?: () => Promise<Record<string, string>>;
      setAttributes?: (attrs: Record<string, string>) => Promise<void>;
      setInnerHTML?: (html: string) => Promise<void>;
      setText?: (text: string) => Promise<void>;
    }>;}
  

    export interface WebflowStyle {
      id?: string;
      name: string;
      setProperties: (props: Record<string, string>) => Promise<void>;
    }


    export type ScriptLocation = "header" | "footer";
  export type ScriptTargetType = "site" | "page";
/**
   * Represents a script application to a specific target (site/page)
   * @property {string} scriptId - The unique identifier for the script
   * @property {ScriptTargetType} targetType - The type of target (site/page)
   * @property {string} targetId - The ID of the target (site/page)
   * @property {string} appliedAt - The date and time when the script was applied
   * @property {string} version - The version of the script
   */

    export interface CodeApplication {
      scriptId: string;
      targetType: ScriptTargetType;
      targetId: string;
      appliedAt?: string;
      version: string;
      location: ScriptLocation;
    }