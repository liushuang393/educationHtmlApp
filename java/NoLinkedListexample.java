/**
 * ポインタを使わないPL/Iコードの純粋Java実装
 * - 配列ベースの静的メモリ管理
 * - インデックスによるリンク
 * - オブジェクト指向設計
 */
public class ArrayBasedLinkedList {
    
    // 定数定義
    private static final int MAX_NODES = 3;
    
    /**
     * ノード内の詳細情報を表すクラス
     */
    public static class NodeDetail {
        private final String description;
        
        public NodeDetail(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
        
        @Override
        public String toString() {
            return description;
        }
    }
    
    /**
     * ノードクラス（インデックスベースのリンク）
     */
    public static class Node {
        private final int id;
        private int nextIndex;  // 次のノードのインデックス
        private final NodeDetail detail;
        
        public Node(int id, NodeDetail detail) {
            this.id = id;
            this.detail = detail;
            this.nextIndex = -1; // 初期値は無効
        }
        
        public int getId() {
            return id;
        }
        
        public int getNextIndex() {
            return nextIndex;
        }
        
        public void setNextIndex(int nextIndex) {
            this.nextIndex = nextIndex;
        }
        
        public NodeDetail getDetail() {
            return detail;
        }
        
        @Override
        public String toString() {
            return String.format("Node{id=%d, nextIndex=%d, detail='%s'}", 
                               id, nextIndex, detail.getDescription());
        }
    }
    
    /**
     * 配列ベースのリンクリスト
     */
    public static class ArrayLinkedList {
        private final Node[] nodes;
        private final int maxSize;
        private int currentSize;
        
        public ArrayLinkedList(int maxSize) {
            this.maxSize = maxSize;
            this.nodes = new Node[maxSize];
            this.currentSize = 0;
        }
        
        /**
         * ノードを配列に追加
         */
        public void addNode(Node node) {
            if (currentSize < maxSize) {
                nodes[currentSize] = node;
                currentSize++;
            }
        }
        
        /**
         * リンクを設定（インデックスベース）
         */
        public void setupLinks() {
            for (int i = 0; i < currentSize; i++) {
                if (i < currentSize - 1) {
                    nodes[i].setNextIndex(i + 1);
                } else {
                    nodes[i].setNextIndex(-1); // 最後のノード
                }
            }
        }
        
        /**
         * リストを走査して内容を出力
         */
        public void printList() {
            System.out.println("--- ノード内容出力 ---");
            int currentIndex = 0; // 最初のノードから開始
            
            while (currentIndex >= 0 && currentIndex < currentSize) {
                Node currentNode = nodes[currentIndex];
                System.out.println("ID: " + currentNode.getId());
                System.out.println("Desc: " + currentNode.getDetail().getDescription());
                currentIndex = currentNode.getNextIndex();
            }
        }
        
        /**
         * 配列の情報を表示
         */
        public void printArrayInfo() {
            System.out.println("配列サイズ: " + maxSize);
            System.out.println("使用中のノード数: " + currentSize);
            System.out.println("空きスロット数: " + (maxSize - currentSize));
        }
        
        /**
         * 配列をクリア
         */
        public void clear() {
            for (int i = 0; i < currentSize; i++) {
                nodes[i] = null;
            }
            currentSize = 0;
            System.out.println("配列をクリアしました（ガベージコレクションにより自動的にメモリが解放されます）");
        }
    }
    
    /**
     * リストビルダークラス
     */
    public static class ListBuilder {
        
        /**
         * 指定された数のノードを持つ配列ベースリストを作成
         */
        public static ArrayLinkedList buildList(int nodeCount) {
            ArrayLinkedList list = new ArrayLinkedList(nodeCount);
            
            // ノードを作成して配列に追加
            for (int i = 1; i <= nodeCount; i++) {
                NodeDetail detail = new NodeDetail("説明-" + i);
                Node node = new Node(i, detail);
                list.addNode(node);
            }
            
            // リンクを設定
            list.setupLinks();
            
            return list;
        }
    }
    
    /**
     * メインメソッド
     */
    public static void main(String[] args) {
        // 配列ベースのリンクリストを作成
        ArrayLinkedList list = ListBuilder.buildList(MAX_NODES);
        
        // 配列の情報を表示
        list.printArrayInfo();
        
        // リストの内容を出力
        list.printList();
        
        // 配列をクリア
        list.clear();
        
        // クリア後の状態を確認
        list.printArrayInfo();
    }
}
