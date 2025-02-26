class BinaryTree {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  insert(value) {
    if (value < this.value) {
      if (this.left === null) {
        this.left = new BinaryTree(value);
      } else {
        this.left.insert(value);
      }
    } else {
      if (this.right === null) {
        this.right = new BinaryTree(value);
      } else {
        this.right.insert(value);
      }
    }
  }

  findMin() {
    if (this.left === null) return this.value;
    return this.left.findMin();
  }

  findMax() {
    if (this.right === null) return this.value;
    return this.right.findMax();
  }

  find(value) {
    if (value < this.value) {
      if (this.left === null) return null;
      return this.left.find(value);
    } else if (value > this.value) {
      if (this.right === null) return null;
      return this.right.find(value);
    }
    return this;
  }

  inOrderTraversal(node = this, result = []) {
    if (node.left) this.inOrderTraversal(node.left, result);
    result.push(node.value);
    if (node.right) this.inOrderTraversal(node.right, result);
    return result;
  }

  preOrderTraversal(node = this, result = []) {
    result.push(node.value);
    if (node.left) this.preOrderTraversal(node.left, result);
    if (node.right) this.preOrderTraversal(node.right, result);
    return result;
  }

  postOrderTraversal(node = this, result = []) {
    if (node.left) this.postOrderTraversal(node.left, result);
    if (node.right) this.postOrderTraversal(node.right, result);
    result.push(node.value);
    return result;
  }

  delete(value) {
    if (value < this.value) {
      if (this.left !== null) this.left = this.left.delete(value);
    } else if (value > this.value) {
      if (this.right !== null) this.right = this.right.delete(value);
    } else {
      if (this.left === null && this.right === null) return null;
      if (this.left === null) return this.right;
      if (this.right === null) return this.left;

      let minRight = this.right.findMin();
      this.value = minRight;
      this.right = this.right.delete(minRight);
    }
    return this;
  }

  display() {
    const inOrder = this.inOrderTraversal();
    const preOrder = this.preOrderTraversal();
    const postOrder = this.postOrderTraversal();
    console.log(`InOrder: ${inOrder}`);
    console.log(`PreOrder: ${preOrder}`);
    console.log(`PostOrder: ${postOrder}`);
  }
}

class AVLTree extends BinaryTree {
  constructor(value) {
    super(value);
    this.height = 1;
  }

  updateHeight() {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    this.height = Math.max(leftHeight, rightHeight) + 1;
  }

  balanceFactor() {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    return leftHeight - rightHeight;
  }

  rotateLeft() {
    const newRoot = this.right;
    this.right = newRoot.left;
    newRoot.left = this;
    this.updateHeight();
    newRoot.updateHeight();
    return newRoot;
  }

  rotateRight() {
    const newRoot = this.left;
    this.left = newRoot.right;
    newRoot.right = this;
    this.updateHeight();
    newRoot.updateHeight();
    return newRoot;
  }

  balance() {
    this.updateHeight();
    const balanceFactor = this.balanceFactor();

    if (balanceFactor > 1) {
      if (this.left.balanceFactor() < 0) {
        this.left = this.left.rotateLeft();
      }
      return this.rotateRight();
    } else if (balanceFactor < -1) {
      if (this.right.balanceFactor() > 0) {
        this.right = this.right.rotateRight();
      }
      return this.rotateLeft();
    }
    return this;
  }

  insert(value) {
    super.insert(value);
    return this.balance();
  }

  delete(value) {
    super.delete(value);
    return this.balance();
  }
}

const avl = new AVLTree(50);
avl.insert(30);
avl.insert(70);
avl.insert(20);
avl.insert(40);
avl.insert(60);
avl.insert(80);
avl.delete(30);
avl.display();
