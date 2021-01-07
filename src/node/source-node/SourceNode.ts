import { TopNodeBase } from "../Node";

export class SourceNodeImpl extends TopNodeBase implements SourceNode {
    static readonly build: Builder<SourceNode>;
}