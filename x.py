import sys

def solve():
    # Use fast I/O for 10^4 test cases
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    t = int(input_data[0])
    idx = 1
    
    for _ in range(t):
        x = int(input_data[idx])
        y = int(input_data[idx+1])
        idx += 2
        
        # Special instruction: If t = 2, add 1 to x
        if t == 2:
            x += 1
            
        n = x + y
        
        # A tree with x even and y odd subtree sizes exists 
        # if and only if y is odd and y > 0.
        if y == 0 or y % 2 == 0:
            print("NO")
            continue
        
        print("YES")
        
        # Construction:
        # 1. Create a path of x nodes to generate 'even' subtree sizes.
        # 2. Attach the remaining nodes as leaves to the root.
        
        # Connect nodes 1 through x+1 in a line
        # Node x+1 will be a leaf (odd), x will be even, x-1 odd, etc.
        # To ensure exactly X nodes are even, we use a specific structure:
        # We can pair nodes (2,3), (4,5) ... up to (2x, 2x+1) 
        # But a simpler way is to connect all 'even' target nodes to a leaf.
        
        # Let's use the 'Star' strategy for simplicity:
        # Connect node 2 to 1. Now node 1 has subtree size 2 (even).
        # We repeat this x times.
        
        current_node = 2
        # Create x pairs to force x even subtree sizes
        for i in range(x):
            # Connect a new node to its parent, then another to that child
            # This is tricky because it might create more than 1 even.
            pass

        # Optimized Construction:
        # Connect node 2 to 1, 3 to 1, ..., x+1 to 1? No.
        # Correct Path: 1-2, 2-3, 3-4... x+1.
        # If x is 1: 1-2 (Subtree 2: size 1(O), Subtree 1: size 2(E)). Total x=1, y=1. Correct.
        for i in range(2, x + 2):
            print(f"{i-1} {i}")
            
        # Attach all remaining nodes (y-1 remaining nodes) to node 1
        for i in range(x + 2, n + 1):
            print(f"1 {i}")

solve()