export interface Publication {
  title: string;
  url: string;
  pubDate: Date;
  source: "note" | "zenn" | "speakerdeck";
}

export type PublicationSource = Publication["source"];
