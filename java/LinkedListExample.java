/**
 * PL/I 複雑なポインタ使用例の純粋Java実装
 * - オブジェクト指向設計による自然な実装
 * - ガベージコレクションによる自動メモリ管理
 * - リンクリストの標準的なJava実装
 */
public class LinkedListExample {
    
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
     * リンクリストのノードクラス
     */
    public static class ListNode {
        private final int id;
        private ListNode next;
        private final NodeDetail detail;
        
        public ListNode(int id, NodeDetail detail) {
            this.id = id;
            this.detail = detail;
            this.next = null;
        }
        
        public int getId() {
            return id;
        }
        
        public ListNode getNext() {
            return next;
        }
        
        public void setNext(ListNode next) {
            this.next = next;
        }
        
        public NodeDetail getDetail() {
            return detail;
        }
        
        @Override
        public String toString() {
            return String.format("Node{id=%d, detail='%s'}", id, detail.getDescription());
        }
    }
    
    /**
     * リンクリストを管理するクラス
     */
    public static class LinkedList {
        private ListNode head;
        private ListNode tail;
        private int size;
        
        public LinkedList() {
            this.head = null;
            this.tail = null;
            this.size = 0;
        }
        
        /**
         * リストの末尾にノードを追加
         */
        public void addNode(ListNode node) {
            if (head == null) {
                head = node;
                tail = node;
            } else {
                tail.setNext(node);
                tail = node;
            }
            size++;
        }
        
        /**
         * リストの内容を出力
         */
        public void printList() {
            System.out.println("--- ノード内容出力 ---");
            ListNode current = head;
            
            while (current != null) {
                System.out.println("ID: " + current.getId());
                System.out.println("Desc: " + current.getDetail().getDescription());
                current = current.getNext();
            }
        }
        
        /**
         * リストのサイズを取得
         */
        public int getSize() {
            return size;
        }
        
        /**
         * リストが空かどうかを判定
         */
        public boolean isEmpty() {
            return head == null;
        }
        
        /**
         * リストをクリア（ガベージコレクションが自動的にメモリを解放）
         */
        public void clear() {
            head = null;
            tail = null;
            size = 0;
            System.out.println("リストをクリアしました（ガベージコレクションにより自動的にメモリが解放されます）");
        }
    }
    
    /**
     * リンクリストのビルダークラス
     */
    public static class LinkedListBuilder {
        
        /**
         * 指定された数のノードを持つリンクリストを作成
         */
        public static LinkedList buildList(int nodeCount) {
            LinkedList list = new LinkedList();
            
            for (int i = 1; i <= nodeCount; i++) {
                // 詳細情報を作成
                NodeDetail detail = new NodeDetail("説明-" + i);
                
                // ノードを作成
                ListNode node = new ListNode(i, detail);
                
                // リストに追加
                list.addNode(node);
            }
            
            return list;
        }
    }
    
    /**
     * メインメソッド
     */
    public static void main(String[] args) {
        // リンクリストを作成
        LinkedList list = LinkedListBuilder.buildList(MAX_NODES);
        
        // リストの内容を出力
        list.printList();
        
        // リストの情報を表示
        System.out.println("リストサイズ: " + list.getSize());
        System.out.println("リストは空ですか: " + list.isEmpty());
        
        // リストをクリア（メモリ解放の代わり）
        list.clear();
        
        // クリア後の状態を確認
        System.out.println("クリア後のリストサイズ: " + list.getSize());
        System.out.println("クリア後のリストは空ですか: " + list.isEmpty());
    }
}
