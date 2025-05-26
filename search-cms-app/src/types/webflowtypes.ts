
export interface WebflowStyle {
  setProperty: (prop: string, value: string) => Promise<void>;
  // setProperties: (properties: Record<string, string>) => Promise<void>;
  setProperties(props: Record<string, string>, options?: BreakpointAndPseudo): Promise<void>;
  save: () => Promise<void>;
}


interface WebflowElement {
  setStyles?: (styles: WebflowStyle[]) => Promise<void>;
  setTextContent?: (text: string) => Promise<void>;
  append?: (element: any) => Promise<WebflowElement | null>;
  before?: (preset: any) => Promise<WebflowElement | null>;
  setHtml?: (html: string) => Promise<void>;
  
  
}

// Define a Webflow API interface
export interface WebflowAPI {
  getSiteInfo: () => Promise<{
    siteId: string;
    siteName: string;
    shortName: string;
    url:string;
  }>;
    getIdToken: () => Promise<string>;

  getSelectedElement: () => Promise<{
    
    before: (preset: any) => Promise<{
      setInnerHTML: (html: string) => Promise<void>;
      setText?: (text: string) => Promise<void>;
      append?: (child: any) => Promise<void>;
      setStyles?: (styles: WebflowStyle[]) => Promise<void>;
      getStyles?: () => Promise<Record<string, string>>;
      setHeadingLevel?: (level: 1 | 2 | 3 | 4 | 5 | 6) => Promise<void>; // 🔥 Added this line
      applyStyle?: (style: WebflowStyle) => Promise<void>;
      setAttribute?: (name: string, value: string) => Promise<null>; // or similar      
      setCustomAttribute?: (name: string, value: string) => Promise<null>;
      setTextContent?: (text: string) => Promise<void>;
      getChildren?: () => Promise<any[]>;
      setSettings(mode: string, value: string, options?: { openInNewTab?: boolean, subject?: string | null })
      getAllElements?: () => Promise<any[]>; // ✅ Added getAllElements here
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
    after: (preset: any) => Promise<{
      setInnerHTML: (html: string) => Promise<void>;
      setText?: (text: string) => Promise<void>;
      append?: (child: any) => Promise<void>;
      setStyles?: (styles: WebflowStyle[]) => Promise<void>;
      getStyles?: () => Promise<Record<string, string>>;
      applyStyle?: (style: WebflowStyle) => Promise<void>;
      setAttribute?: (name: string, value: string) => Promise<null>; // or similar      
      setCustomAttribute?: (name: string, value: string) => Promise<null>;
      setTextContent?: (text: string) => Promise<void>;
      getChildren?: () => Promise<any[]>;
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
  }>;

  elementPresets: {
    DivBlock: any;
    Paragraph?: any;
    Heading?: any;
    Button?: any;
    DOM?: any;
    FormBlock?:any;
    Form?: any
    CheckboxField?: any
    Checkbox?:any
    PlainText?:any
    FormForm?:any
    FormCheckboxInput?:any
    LinkBlock?:any
    HtmlEmbed?:any
    Image?:any
  };

  getRootElement: () => Promise<{
    setInnerHTML: (html: string) => Promise<void>;
    setText?: (text: string) => Promise<void>;
  }>;

  elementBuilder: (preset: any) => Promise<{
    setTag: (tag: string) => void;
    setInnerHTML?: (html: string) => Promise<void>;
    setText?: (text: string) => Promise<void>;
    setAttributes?: (attrs: Record<string, string>) => Promise<void>;
    setStyles?: (styles: WebflowStyle[]) => Promise<void>;
    append: (child: any) => Promise<void>;
    
  }>;

  getCurrentPage: () => Promise<{ id: string; name: string ,}>;
  createPage: (options: { name: string; content: string }) => Promise<{ id: string }>;
  switchPage?: (pageId: string) => Promise<void>;
  getAllPagesAndFolders?: () => Promise<Array<{ id: string; type: string; getName: () => Promise<string> ; url:string }>>;

  createStyle: (name: string) => Promise<WebflowStyle>;
  getStyleByName: (name: string) => Promise<WebflowStyle | null>;
  getAllStyles?: () => Promise<WebflowStyle[]>;
  removeStyle?: (styleId: string) => Promise<void>;
  getAllElements?: () => Promise<any[]>; // ✅ Added here, directly on WebflowAPI


  getDefaultVariableCollection?: () => Promise<{
    createColorVariable: (name: string, value: string) => Promise<{ id: string; name: string; value: string }>;
  }>;

  notify: (options: { type: "info" | "error"; message: string }) => Promise<void>;

  getMediaQuery?: () => Promise<string>;
  getCurrentAppConnection?: () => Promise<{ id: string; name: string }>;
  getAllAssets?: () => Promise<Array<{ id: string; name: string; url: string }>>;
}

// Declare Webflow globally
declare const webflow: WebflowAPI;
export default webflow;